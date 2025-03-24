// Day 2: Parser Implementation

(function () {
    'use strict';

    // Prepare an empty cache for parsed format strings
    const MAX_CACHE_SIZE = 100;
    const sprintf_cache = new Map();

    // Pre-compile regular expressions for better performance
    const re = {
        text: /^[^%]+/, // Matches normal text
        modulo: /^%%/, // Matches '%%' escape sequence
        placeholder: /^%(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/
    };

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
