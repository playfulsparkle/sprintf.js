(function () {
    'use strict';

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
