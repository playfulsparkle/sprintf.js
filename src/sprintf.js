/* global window, exports, define */

!function () {
    'use strict';

    const re = {
        notType: /[^T]/,
        notPrimitive: /[^v]/,
        number: /[diefg]/,
        numericArg: /[bcdiefguxX]/,
        jsonObject: /[j]/,
        plainText: /^[^\x25]+/,
        doublePercent: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        namedKey: /^([a-z_][a-z_\d]*)/i,
        dotAccess: /^\.([a-z_][a-z_\d]*)/i,
        bracketAccess: /^\[(\d+)\]/,
        numeralPrefix: /^[+-]/
    };

    const sprintfCache = new Map();

    function sprintf(key) {
        const parseResult = parse(key);
        return format(parseResult.parseTree, Array.from(arguments).slice(1), parseResult.namedUsed);
    }

    function vsprintf(format, argv) {
        return sprintf.apply(null, [format].concat(argv || []));
    }

    function format(parseTree, argv, usesNamedArgs) {
        let cursor = 0;
        const treeLength = parseTree.length;
        const namedArgs = Object.create(null);
        let output = '';

        // Extract named arguments and filter positional arguments if named are used
        const filteredArgv = [];

        if (usesNamedArgs) {
            for (let idx = 0; idx < argv.length; idx++) {
                if (argv[idx] !== null && typeof argv[idx] === 'object' && !Array.isArray(argv[idx])) {
                    Object.assign(namedArgs, argv[idx]);
                } else {
                    filteredArgv.push(argv[idx]);
                }
            }

            // Use filteredArgv for positional parameters
            argv = filteredArgv;
        }

        for (let idx = 0; idx < treeLength; idx++) {
            const placeholder = parseTree[idx];
            let arg;
            let isPositive;
            let numeralPrefix = '';

            if (typeof placeholder === 'string') {
                output += placeholder;

                continue;
            }


            // Get the argument value
            if (placeholder.keys) { // keyword argument
                arg = namedArgs;

                for (let k = 0; k < placeholder.keys.length; k++) {
                    if (arg === undefined || arg === null) {
                        throw new Error(`[sprintf] Cannot access property "${placeholder.keys[k]}" of undefined value`);
                    }

                    arg = arg[placeholder.keys[k]];
                }
            } else if (placeholder.paramNo) { // positional argument (explicit)
                arg = argv[placeholder.paramNo - 1];
            } else { // positional argument (implicit)
                arg = argv[cursor++];
            }

            // Invoke if function
            if (re.notType.test(placeholder.type) && re.notPrimitive.test(placeholder.type) && typeof arg === 'function') {
                try {
                    arg = arg();
                } catch (e) {
                    throw new Error('[sprintf] Failed to execute function argument');
                }
            }

            // Validate numeric arguments
            if (re.numericArg.test(placeholder.type) && (typeof arg !== 'number' && isNaN(arg))) {
                throw new TypeError(`[sprintf] expecting number but found ${typeof arg}`);
            }

            // Format according to type
            if (re.number.test(placeholder.type)) {
                isPositive = arg >= 0;
            }

            switch (placeholder.type) {
                case 'b':
                    arg = parseInt(arg, 10).toString(2);
                    break;
                case 'c':
                    arg = String.fromCharCode(parseInt(arg, 10));
                    break;
                case 'd':
                case 'i':
                    arg = parseInt(arg, 10);
                    break;
                case 'j':
                    arg = JSON.stringify(arg, null, placeholder.width ? parseInt(placeholder.width) : 0);
                    break;
                case 'e':
                    arg = placeholder.precision ? parseFloat(arg).toExponential(placeholder.precision) : parseFloat(arg).toExponential();
                    break;
                case 'f':
                    arg = placeholder.precision ? parseFloat(arg).toFixed(placeholder.precision) : parseFloat(arg);
                    break;
                case 'g':
                    arg = placeholder.precision ? String(Number(arg.toPrecision(placeholder.precision))) : parseFloat(arg);
                    break;
                case 'o':
                    arg = (parseInt(arg, 10) >>> 0).toString(8);
                    break;
                case 's':
                    arg = String(arg);
                    arg = (placeholder.precision ? arg.substring(0, placeholder.precision) : arg);
                    break;
                case 't':
                    arg = String(!!arg);
                    arg = (placeholder.precision ? arg.substring(0, placeholder.precision) : arg);
                    break;
                case 'T':
                    arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
                    arg = (placeholder.precision ? arg.substring(0, placeholder.precision) : arg);
                    break;
                case 'u':
                    arg = parseInt(arg, 10) >>> 0;
                    break;
                case 'v':
                    arg = String(arg.valueOf());
                    arg = (placeholder.precision ? arg.substring(0, placeholder.precision) : arg);
                    break;
                case 'x':
                    arg = (parseInt(arg, 10) >>> 0).toString(16);
                    break;
                case 'X':
                    arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
                    break;
                default:
                    throw new Error(`[sprintf] Unknown type: ${placeholder.type}`);
            }

            // Handle output formatting
            if (re.jsonObject.test(placeholder.type)) {
                output += arg;
            } else {
                if (re.number.test(placeholder.type) && (!isPositive || placeholder.numeralPrefix)) {
                    numeralPrefix = isPositive ? '+' : '-';
                    arg = String(arg).replace(re.numeralPrefix, '');
                }

                const padCharacter = placeholder.padChar ? placeholder.padChar === '0' ? '0' : placeholder.padChar.charAt(1) : ' ';
                const padLength = placeholder.width - (numeralPrefix + arg).length;
                const pad = placeholder.width && padLength > 0 ? padCharacter.repeat(padLength) : '';

                output += placeholder.align ? numeralPrefix + arg + pad : (padCharacter === '0' ? numeralPrefix + pad + arg : pad + numeralPrefix + arg);
            }
        }

        return output;
    }

    function parse(format) {
        // Check cache first
        const cached = sprintfCache.get(format);

        if (cached) {
            return cached;
        }

        let _format = format;
        const parseTree = [];
        let match;
        let namedUsed = false;
        let positionalUsed = false;

        while (_format) {
            if ((match = re.plainText.exec(_format)) !== null) {
                parseTree.push(match[0]);
            } else if ((match = re.doublePercent.exec(_format)) !== null) {
                parseTree.push('%');
            } else if ((match = re.placeholder.exec(_format)) !== null) {
                if (match[2]) { // Named placeholder
                    namedUsed = true;
                    const fieldList = [];
                    let replacementField = match[2];
                    let fieldMatch;

                    if ((fieldMatch = re.namedKey.exec(replacementField)) !== null) {
                        fieldList.push(fieldMatch[1]);

                        while ((replacementField = replacementField.substring(fieldMatch[0].length)) !== '') {
                            if ((fieldMatch = re.dotAccess.exec(replacementField)) !== null) {
                                fieldList.push(fieldMatch[1]);
                            } else if ((fieldMatch = re.bracketAccess.exec(replacementField)) !== null) {
                                fieldList.push(fieldMatch[1]);
                            } else {
                                throw new SyntaxError('[sprintf] failed to parse named argument key');
                            }
                        }
                    }
                    else {
                        throw new SyntaxError('[sprintf] failed to parse named argument key');
                    }

                    match[2] = fieldList;
                }
                else if (match[1]) { // Explicit positional placeholder
                    positionalUsed = true;
                }
                else { // Implicit positional placeholder
                    positionalUsed = true;
                }

                parseTree.push({
                    placeholder: match[0],
                    paramNo: match[1],
                    keys: match[2],
                    numeralPrefix: match[3],
                    padChar: match[4],
                    align: match[5],
                    width: match[6],
                    precision: match[7],
                    type: match[8]
                });
            }
            else {
                throw new SyntaxError('[sprintf] unexpected placeholder');
            }

            _format = _format.substring(match[0].length);
        }

        const result = {
            parseTree,
            namedUsed,
            positionalUsed
        };

        sprintfCache.set(format, result);

        return result;
    }

    // Export module
    const sprintfLib = {
        sprintf: sprintf,
        vsprintf: vsprintf
    };

    // Browser export
    if (typeof window !== 'undefined') {
        // Safely expose to window without overwriting
        window.sprintf = sprintf;
        window.vsprintf = vsprintf;

        // AMD support
        if (typeof define === 'function' && define.amd) {
            define(() => sprintfLib);
        }
    }

    // CommonJS export
    if (typeof exports !== 'undefined') {
        exports.sprintf = sprintf;
        exports.vsprintf = vsprintf;
    }

    // ES modules export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = sprintfLib;
    }
}();
