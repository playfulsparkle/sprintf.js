// Day 3: Formatter Implementation

(function () {
    'use strict';

    // Prepare an empty cache for parsed format strings
    const MAX_CACHE_SIZE = 100;
    const sprintf_cache = new Map();

    // Pre-compile regular expressions for better performance
    const re = {
        not_string: /[^s]/,
        not_bool: /[^t]/,
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^%]+/,
        modulo: /^%%/,
        placeholder: /^%(?:([1-9]\d*)\$|\\(([^)]+)\\))?(\\+)?(0|'[^$])?(-)?(\\d+)?(?:\\.(\\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)]/,
        sign: /^[+-]/
    };

    function sprintf(key) {
        const parseResult = parse(key)
        return format(parseResult.parse_tree, Array.from(arguments).slice(1), parseResult.named_used)
    }

    function format(parse_tree, argv, uses_named_args) {
        let cursor = 0;
        const tree_length = parse_tree.length;
        const named_args = {};
        let output = '';

        let filtered_argv = [];
        if (uses_named_args) {
            for (let i = 0; i < argv.length; i++) {
                const arg = argv[i];
                if (arg !== null && typeof arg === 'object' && !Array.isArray(arg)) {
                    Object.assign(named_args, arg);
                } else {
                    filtered_argv.push(arg);
                }
            }
        }

        argv = filtered_argv;

        for (let i = 0; i < tree_length; i++) {
            const ph = parse_tree[i];
            let arg;
            let is_positive;
            let sign = '';

            if (typeof ph === 'string') {
                output += ph;
                continue;
            }

            if (ph.keys) {
                arg = named_args;
                for (let k = 0; k < ph.keys.length; k++) {
                    if (arg === undefined || arg === null) {
                        throw new Error('[sprintf] Cannot access property "' + ph.keys[k] + '" of undefined value');
                    }
                    arg = arg[ph.keys[k]];
                }
            } else if (ph.param_no) {
                arg = argv[ph.param_no - 1];
            } else {
                arg = argv[cursor++];
            }

            if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && typeof arg === 'function') {
                try {
                    arg = arg();
                } catch (e) {
                    throw new Error('[sprintf] Failed to execute function argument');
                }
            }

            if (re.numeric_arg.test(ph.type) && (typeof arg !== 'number' && isNaN(arg))) {
                throw new TypeError('[sprintf] expecting number but found ' + typeof arg);
            }

            if (re.number.test(ph.type)) {
                is_positive = arg >= 0;
            }

            switch (ph.type) {
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
                    arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0);
                    break;
                case 'e':
                    arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential();
                    break;
                case 'f':
                    arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg);
                    break;
                case 'g':
                    arg = ph.precision ? String(Number(arg).toPrecision(ph.precision)) : parseFloat(arg);
                    break;
                case 'o':
                    arg = (parseInt(arg, 10) >>> 0).toString(8);
                    break;
                case 's':
                    arg = String(arg);
                    arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                    break;
                case 't':
                    arg = String(!!arg);
                    arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                    break;
                case 'T':
                    arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
                    arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                    break;
                case 'u':
                    arg = parseInt(arg, 10) >>> 0;
                    break;
                case 'v':
                    arg = String(arg.valueOf());
                    arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                    break;
                case 'x':
                    arg = (parseInt(arg, 10) >>> 0).toString(16);
                    break;
                case 'X':
                    arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
                    break;
                default:
                    throw new Error('[sprintf] Unknown type: ' + ph.type);
            }

            if (re.json.test(ph.type)) {
                output += arg;
            } else {
                if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
                    sign = is_positive ? '+' : '-';
                    arg = String(arg).replace(re.sign, '');
                }

                const pad_character = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' ';
                const pad_length = ph.width - (sign + arg).length;
                const pad = ph.width && pad_length > 0 ? pad_character.repeat(pad_length) : '';

                output += ph.align ? sign + arg + pad : (pad_character === '0' ? sign + pad + arg : pad + sign + arg);
            }
        }

        return output;
    }


    function parse(fmt) {
        const cached = sprintf_cache.get(fmt);
        if (cached) return cached;

        let _fmt = fmt;
        const parse_tree = [];
        let match;

        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree.push(match[0]);
            } else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree.push('%');
            } else if ((match = re.placeholder.exec(_fmt)) !== null) {
                parse_tree.push({
                    param_no: match[1],
                    keys: match[2] ? match[2].split('.') : null,
                    sign: match[3],
                    pad_char: match[4],
                    align: match[5],
                    width: match[6],
                    precision: match[7],
                    type: match[8]
                });
            } else {
                throw new SyntaxError('[sprintf] Unexpected format placeholder');
            }
            _fmt = _fmt.substring(match[0].length);
        }

        if (sprintf_cache.size >= MAX_CACHE_SIZE) {
            const firstKey = sprintf_cache.keys().next().value;
            sprintf_cache.delete(firstKey);
        }

        const result = { parse_tree };
        sprintf_cache.set(fmt, result);
        return result;
    }

    function sprintf() {
        throw new Error('sprintf not implemented yet');
    }

    function vsprintf() {
        throw new Error('vsprintf not implemented yet');
    }

    // Export module
    const sprintfLib = { sprintf, vsprintf };

    if (typeof window !== 'undefined') {
        window.sprintf = sprintf;
        window.vsprintf = vsprintf;
    }

    if (typeof exports !== 'undefined') {
        exports.sprintf = sprintf;
        exports.vsprintf = vsprintf;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = sprintfLib;
    }
})();
