/* global describe, it */

'use strict';

const assert = require('assert'),
    sprintfjs = require('../src/sprintf.js'),
    { sprintf } = sprintfjs,
    { vsprintf } = sprintfjs;

function shouldThrow(format, args, err) {
    assert.throws(() => { vsprintf(format, args); }, err);
}

function shouldNotThrow(format, args) {
    assert.doesNotThrow(() => { vsprintf(format, args); });
}

describe('sprintfjs Cache Behavior', () => {

    it('should not throw an Error after redefining Object.prototype properties (cache consistency)', () => {
        // Redefine object properties to ensure that is not affect to the cache
        sprintf('hasOwnProperty');
        sprintf('constructor');
        shouldNotThrow('%s', ['caching...']);
        shouldNotThrow('%s', ['crash?']);
    });
});

describe('sprintfjs Error Handling', () => {

    describe('Callbacks', () => {
        it('should throw Error when we try to format a string using a callback function', () => {
            assert.throws(() => { sprintf('%s', () => { return 'foobar'; }); }, Error);
        });

        it('should not throw Error when we try to format undefined as "undefined" using a callback function', () => {
            assert.doesNotThrow(() => { sprintf('%T', undefined); }, Error);
        });

        it('should not throw Error when we try to format true as "true" using a callback function', () => {
            assert.doesNotThrow(() => { sprintf('%v', true); }, Error);
        });
    });

    describe('Invalid Placeholders', () => {
        it('should throw SyntaxError for missing parameter', () => {
            assert.throws(() => { sprintf.config().throwErrorOnUnmatched(true).sprintf('Two params needed 1: %s 2: %s', 'one'); }, SyntaxError);
        });

        it('should throw SyntaxError for missing arguments by index', () => {
            assert.throws(() => { sprintf.config().throwErrorOnUnmatched(true).sprintf('%2$s %3$s a %1$s', 'cracker', 'Polly'); }, SyntaxError);
        });

        it('should throw SyntaxError for missing arguments by name', () => {
            assert.throws(() => { sprintf.config().throwErrorOnUnmatched(true).sprintf('Two params needed 1: %(first)s 2: %(second)s', { first: 'one' }); }, SyntaxError);
        });

        it('should throw SyntaxError for a single percent sign', () => {
            shouldThrow('%', SyntaxError);
        });

        it('should throw SyntaxError for a percent sign followed by an invalid character', () => {
            shouldThrow('%A', SyntaxError);
        });

        it('should throw SyntaxError for a percent sign within a string placeholder', () => {
            shouldThrow('%s%', SyntaxError);
        });

        it('should throw SyntaxError for an unclosed named placeholder (opening parenthesis)', () => {
            shouldThrow('%(s', SyntaxError);
        });

        it('should throw SyntaxError for an unclosed named placeholder (closing parenthesis)', () => {
            shouldThrow('%)s', SyntaxError);
        });

        it('should throw SyntaxError for a positional placeholder with a dollar sign but no index', () => {
            shouldThrow('%$s', SyntaxError);
        });

        it('should throw SyntaxError for an empty named placeholder', () => {
            shouldThrow('%()s', SyntaxError);
        });

        it('should throw SyntaxError for a named placeholder with a numeric name', () => {
            shouldThrow('%(12)s', SyntaxError);
        });
    });

    describe('Invalid Arguments for Numeric Specifiers', () => {
        const numeric = 'bcdiefguxX'.split('');

        numeric.forEach((specifier) => {
            const fmt = sprintf('%%%s', specifier);

            it(`${fmt} should throw TypeError when no argument is provided`, () => {
                shouldThrow(fmt, TypeError);
            });

            it(`${fmt} should throw TypeError when a string is provided`, () => {
                shouldThrow(fmt, ['str'], TypeError);
            });

            it(`${fmt} should throw TypeError when an object is provided`, () => {
                shouldThrow(fmt, [{}], TypeError);
            });

            it(`${fmt} should throw TypeError when the string 's' is provided`, () => {
                shouldThrow(fmt, ['s'], TypeError);
            });

            it(`${fmt} should not throw TypeError for values implicitly castable to a number`, () => {
                shouldNotThrow(fmt, [1 / 0]);
                shouldNotThrow(fmt, [true]);
                shouldNotThrow(fmt, [[1]]);
                shouldNotThrow(fmt, ['200']);
                shouldNotThrow(fmt, [null]);
            });
        });
    });

    describe('Named Placeholders with Object Access', () => {
        it('should not throw an Error when accessing a property that evaluates to undefined', () => {
            shouldNotThrow('%(x.y)s', { x: {} });
        });

        it('should throw an Error containing "[sprintf]" when accessing a property that would raise TypeError', () => {
            const fmt = '%(x.y)s';
            try {
                sprintf(fmt, {});
            } catch (e) {
                assert(e.message.indexOf('[sprintf]') !== -1);
            }
        });
    });

    describe('Accessing Prototype Properties', () => {
        it('should not throw an Error when accessing a getter property on the prototype', () => {
            function C() { }
            C.prototype = {
                get x() { return 2; },
                set y(v) { /*Noop */ }
            };
            const c = new C();
            shouldNotThrow('%(x)s', c); // Expectation: No error is thrown
        });

        it('should not throw an Error when accessing a setter property on the prototype', () => {
            function C() { }
            C.prototype = {
                get x() { return 2; },
                set y(v) { /*Noop */ }
            };
            const c = new C();
            shouldNotThrow('%(y)s', c); // Expectation: No error is thrown
        });
    });
});
