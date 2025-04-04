/*! @playfulsparkle/sprintf-js v1.0.2 | Copyright (c) 2025-present, Zsolt Oroszlány <hello@playfulsparkle.com> | BSD-3-Clause */
/* global window, exports, define */

!function () {
    'use strict';

    /**
     * Regular expressions used for parsing format strings
     * @namespace
     */
    const re = {
        // Matches if type is NOT 'T' (type detection)
        notType: /[^T]/,
        // Matches if type is NOT 'v' (primitive value)
        notPrimitive: /[^v]/,
        // Matches numeric format specifiers
        number: /[diefg]/,
        // Matches numeric argument types requiring number validation
        numericArg: /[bcdiefguxX]/,
        // Matches JSON object specifier
        jsonObject: /[j]/,
        // Matches plain text between format specifiers
        plainText: /^[^\x25]+/,
        // Matches double percent (escaped percent)
        doublePercent: /^\x25{2}/,
        // Matches format placeholder components
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        // Matches valid named argument keys
        namedKey: /^([a-z_][a-z_\d]*)/i,
        // Matches dot notation in named arguments
        dotAccess: /^\.([a-z_][a-z_\d]*)/i,
        // Matches array index access in named arguments
        bracketAccess: /^\[(\d+)\]/,
        // Matches numeric sign prefixes
        numeralPrefix: /^[+-]/,
        allowedNamedKeyChars: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
        allowedNumericIndex: /^\d+$/
    };

    /**
     * Cache for parsed format strings to improve performance
     * @type {Map<string, {parseTree: Array<string|Placeholder>, namedUsed: boolean, positionalUsed: boolean}>}
     */
    const sprintfCache = createCache(); // Optimized version of new Map();

    /**
     * @typedef {Object} Placeholder
     * @property {string} placeholder - The entire matched placeholder string
     * @property {string} [paramNo] - Positional parameter number (1-based index)
     * @property {Array<string>} [keys] - Named parameter access path
     * @property {string} [numeralPrefix] - '+' sign for positive numbers
     * @property {string} [padChar] - Padding character (e.g., '0' or space)
     * @property {boolean} [align] - Left-align flag (true when '-' present)
     * @property {string} [width] - Minimum field width
     * @property {string} [precision] - Precision for numbers/strings
     * @property {string} type - Conversion type character
     */

    /**
     * Main formatting function similar to C's sprintf
     * @param {string} format - Format string containing placeholders
     * @param {...*} args - Values to format
     * @returns {string} Formatted string
     * @throws {Error} On invalid arguments or formatting errors
     */
    function sprintf(format) {
        const parseResult = sprintfParse(format);
        // Replaced Array.from(arguments).slice(1) in favor of Array.prototype.slice.call(arguments, 1)
        return sprintfFormat(parseResult.parseTree, Array.prototype.slice.call(arguments, 1), parseResult.namedUsed);
    }

    /**
     * Version of sprintf that accepts arguments as an array
     * @param {string} format - Format string
     * @param {Array} argv - Array of values to format
     * @returns {string} Formatted string
     */
    function vsprintf(format, argv) {
        return sprintf.apply(null, [format].concat(argv || []));
    }

    /**
     * Core formatting engine that processes parsed format tree
     * @param {Array<string|Placeholder>} parseTree - Result from sprintfParse()
     * @param {Array} argv - Values to format
     * @param {boolean} usesNamedArgs - Whether format uses named arguments
     * @returns {string} Formatted string
     * @throws {TypeError} On invalid numeric arguments
     * @throws {Error} On missing named arguments
     */
    function sprintfFormat(parseTree, argv, usesNamedArgs) {
        // Because of removing __proto__ parsetree can be undefined
        if (typeof parseTree === 'undefined') return '';

        let cursor = 0;
        const treeLength = parseTree.length;
        const namedArgs = { __proto__: null };
        let output = '';

        // Extract named arguments and filter positional arguments if named are used
        const filteredArgv = [];

        if (usesNamedArgs) {
            for (let idx = 0; idx < argv.length; idx++) {
                const arg = argv[idx];

                if (
                    arg !== null &&
                    typeof arg === 'object' &&
                    Object.prototype.toString.call(arg) !== '[object Array]'
                ) { // Replace Array.isArray in favor of Object.prototype.toString.call(arg) === '[object Array]'
                    objectAssign(namedArgs, arg);
                } else {
                    filteredArgv.push(arg);
                }
            }

            // Use filteredArgv for positional parameters
            argv = filteredArgv;
        }

        for (let idx = 0; idx < treeLength; idx++) {
            const placeholder = parseTree[idx];

            if (typeof placeholder === 'string') {
                output += placeholder;

                continue;
            }

            let arg;

            // Get the argument value
            if (placeholder.keys) { // keyword argument
                arg = namedArgs;

                for (let k = 0; k < placeholder.keys.length; k++) {
                    const placeholderKey = placeholder.keys[k];

                    if (arg === undefined || arg === null) {
                        throw new Error(`[sprintf] Cannot access property "${placeholderKey}" of undefined value`);
                    }

                    arg = arg[placeholderKey];
                }
            } else if (placeholder.paramNo) { // Explicit positional argument
                arg = argv[placeholder.paramNo - 1];
            } else { // Implicit positional argument
                arg = argv[cursor++];
            }

            // Validate numeric arguments for numeric placeholders
            if (re.numericArg.test(placeholder.type) && (typeof arg !== 'number' && isNaN(arg))) {
                throw new TypeError(`[sprintf] expecting number but found ${typeof arg}`);
            }

            let isPositive;
            let numeralPrefix = '';

            // Format according to type
            if (re.number.test(placeholder.type)) {
                isPositive = arg >= 0;
            }

            // Process argument based on format specifier
            switch (placeholder.type) {
                case 'b': // Binary
                    arg = parseInt(arg, 10).toString(2);
                    break;
                case 'c': // Character
                    arg = String.fromCharCode(parseInt(arg, 10));
                    break;
                case 'd': // Integer
                case 'i':
                    arg = parseInt(arg, 10);
                    break;
                case 'j': // JSON
                    arg = JSON.stringify(arg, null, placeholder.width ? parseInt(placeholder.width) : 0);
                    break;
                case 'e': // Exponential notation
                    arg = placeholder.precision ? parseFloat(arg).toExponential(placeholder.precision) : parseFloat(arg).toExponential();
                    break;
                case 'f': // Fixed-point
                    arg = placeholder.precision ? parseFloat(arg).toFixed(placeholder.precision) : parseFloat(arg);
                    break;
                case 'g': // General format
                    arg = placeholder.precision ? String(arg.toPrecision(placeholder.precision)) : parseFloat(arg);
                    break;
                case 'o': // Octal
                    arg = (parseInt(arg, 10) >>> 0).toString(8);
                    break;
                case 's': // String
                    arg = String(arg);
                    arg = (placeholder.precision ? arg.substring(0, placeholder.precision) : arg);
                    break;
                case 't': // Boolean
                    arg = String(!!arg);
                    arg = (placeholder.precision ? arg.substring(0, placeholder.precision) : arg);
                    break;
                case 'T': // Type detection
                    arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
                    arg = (placeholder.precision ? arg.substring(0, placeholder.precision) : arg);
                    break;
                case 'u': // Unsigned integer
                    arg = parseInt(arg, 10) >>> 0;
                    break;
                case 'v': // Primitive value
                    arg = String(arg.valueOf());
                    arg = (placeholder.precision ? arg.substring(0, placeholder.precision) : arg);
                    break;
                case 'x': // Hexadecimal (lowercase)
                    arg = (parseInt(arg, 10) >>> 0).toString(16);
                    break;
                case 'X': // Hexadecimal (uppercase)
                    arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
                    break;
                default:
                    throw new Error(`[sprintf] Unknown type: ${placeholder.type}`);
            }

            // Apply padding and alignment
            if (re.jsonObject.test(placeholder.type)) {
                output += arg;
            } else {
                // Handle numeric sign prefix
                if (re.number.test(placeholder.type) && (!isPositive || placeholder.numeralPrefix)) {
                    numeralPrefix = isPositive ? '+' : '-';
                    arg = String(arg).replace(re.numeralPrefix, '');
                }

                const padCharacter = placeholder.padChar ? placeholder.padChar === '0' ? '0' : placeholder.padChar.charAt(1) : ' ';
                const padLength = placeholder.width - (numeralPrefix + arg).length;
                const pad = placeholder.width && padLength > 0 ? stringRepeat(padCharacter, padLength) : ''; // padCharacter.repeat(padLength) replaced in favor of custom function

                output += placeholder.align ? numeralPrefix + arg + pad : (padCharacter === '0' ? numeralPrefix + pad + arg : pad + numeralPrefix + arg);
            }
        }

        return output;
    }

    /**
     * Parses format string into executable tree structure
     * @param {string} format - Format string to parse
     * @returns {{parseTree: Array<string|Placeholder>, namedUsed: boolean, positionalUsed: boolean}}
     * @throws {SyntaxError} On invalid format syntax
     */
    function sprintfParse(format) {
        if (sprintfCache.has(format)) {
            return sprintfCache.get(format);
        }

        let _format = format;
        const parseTree = [];
        let namedUsed = false;
        let positionalUsed = false;

        while (_format) {
            let match;

            // Match plain text between placeholders
            if ((match = re.plainText.exec(_format)) !== null) {
                parseTree.push(match[0]);
            }
            // Match escaped percent (%%)
            else if ((match = re.doublePercent.exec(_format)) !== null) {
                parseTree.push('%');
            }
            // Match complex placeholders
            else if ((match = re.placeholder.exec(_format)) !== null) {
                // Handle named arguments
                if (match[2]) {
                    namedUsed = true;
                    const fieldList = [];
                    let replacementField = match[2];
                    let fieldMatch;

                    if ((fieldMatch = re.namedKey.exec(replacementField)) !== null) {
                        if (!re.allowedNamedKeyChars.test(fieldMatch[1])) {
                            throw new SyntaxError('[sprintf] Invalid named argument key segment: must start with a letter or underscore, followed by letters, numbers, or underscores');
                        }

                        fieldList.push(fieldMatch[1]);

                        while ((replacementField = replacementField.substring(fieldMatch[0].length)) !== '') {
                            if ((fieldMatch = re.dotAccess.exec(replacementField)) !== null) {
                                if (!re.allowedNamedKeyChars.test(fieldMatch[1])) {
                                    throw new SyntaxError('[sprintf] Invalid named argument key segment after dot: must start with a letter or underscore, followed by letters, numbers, or underscores');
                                }

                                fieldList.push(fieldMatch[1]);
                            } else if ((fieldMatch = re.bracketAccess.exec(replacementField)) !== null) {
                                if (!re.allowedNumericIndex.test(fieldMatch[1])) { // Ensure index is a number
                                    throw new SyntaxError('[sprintf] Invalid array index in named argument key: must be a non-negative integer');
                                }

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
                // Handle positional arguments
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

    /**
     * Copies the values of all of the enumerable own properties from one or
     * more source objects to a target object. It will return the target object.
     * @param {object} target The target object to apply the sources' properties to.
     * @param {...object} sources The source object(s) from which to copy properties.
     * @returns {object} The target object.
     * @throws {TypeError} If target is null or undefined.
     * @throws {TypeError} If no arguments are provided.
     */
    function objectAssign(target) {
        if (arguments.length < 1) {
            throw new TypeError('objectAssign expects at least one argument');
        }

        if (target === null || target === undefined) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        for (let idx = 1; idx < arguments.length; idx++) {
            const source = arguments[idx];

            if (source === null || source === undefined) {
                continue;
            }

            for (const key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) { // Only copy properties that are directly on the source object (not inherited)
                    target[key] = source[key];
                }
            }
        }

        return target;
    }

    /**
     * Constructs and returns a new string which contains the specified number
     * of copies of the string on which it was called, concatenated together.
     * @param {string} character The string to be repeated.
     * @param {number} count An integer indicating the number of times to repeat the string.
     * @returns {string} A new string containing the specified number of copies of the given character.
     * @throws {RangeError} If count is negative.
     */
    function stringRepeat(character, count) {
        if (count < 0) {
            throw new RangeError('Repeat count must be non-negative');
        }

        if (count === 0) {
            return '';
        }

        let result = '';

        while (count) {
            if (count & 1) { // Bitwise operations to handle count
                result += character;
            }

            count >>= 1; // Bitwise right shift (equivalent to count = Math.floor(count / 2))

            character += character;
        }

        return result;
    }

    /**
     * Creates and returns a simple cache object.
     * @returns {object} An object with methods for managing a cache.
     */
    function createCache() {
        let cache = { __proto__: null };

        return {
            /**
             * Retrieves a value from the cache.
             * @param {string} key The key of the value to retrieve.
             * @returns {*} The value associated with the key, or undefined if not found.
             */
            get: function (key) {
                return cache[key];
            },
            /**
             * Stores a value in the cache.
             * @param {string} key The key to store the value under.
             * @param {*} value The value to store.
             * @returns {this} The cache object for chaining.
             */
            set: function (key, value) {
                cache[key] = value;

                return this;
            },
            /**
             * Checks if a key exists in the cache.
             * @param {string} key The key to check for.
             * @returns {boolean} True if the key exists in the cache, false otherwise.
             */
            has: function (key) {
                return key in cache;
            },
            /**
             * Removes a key and its associated value from the cache.
             * @param {string} key The key to remove.
             */
            delete: function (key) {
                delete cache[key];
            },
            /**
             * Clears all entries from the cache.
             */
            clear: function () {
                cache = { __proto__: null };
            }
        };
    }

    // Module export setup
    const sprintfLib = {
        sprintf: sprintf,
        vsprintf: vsprintf
    };

    // Browser global export
    if (typeof window !== 'undefined') {
        // Safely expose to window without overwriting
        window.sprintf = sprintf;
        window.vsprintf = vsprintf;

        // AMD module definition
        if (typeof define === 'function' && define.amd) {
            define(() => sprintfLib);
        }
    }

    // CommonJS export
    if (typeof exports !== 'undefined') {
        exports.sprintf = sprintf;
        exports.vsprintf = vsprintf;
    }

    // Node.js module export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = sprintfLib;
    }
}();
