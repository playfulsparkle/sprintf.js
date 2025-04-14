/* global describe, it */

'use strict';

const assert = require('assert'),
    sprintfjs = require('../src/sprintf.js'),
    { sprintf } = sprintfjs;

describe('sprintfjs', () => {
    describe('Simple Placeholders', () => {
        it('should format correctly unmatched placeholder', () => {
            const sprintfConfig = sprintf.config({ preserveUnmatchedPlaceholder: true });

            const firstPass = sprintfConfig.sprintf('My name is %(firstname)s %(lastname)s', { lastname: 'Doe' });

            assert.strictEqual('My name is %(firstname)s Doe', sprintfConfig.sprintf(firstPass));

            assert.strictEqual('My name is John Doe', sprintfConfig.sprintf(firstPass, { firstname: 'John' }));
        });

        it('should format a percentage sign', () => {
            assert.strictEqual('%', sprintf('%%'));
        });

        it('should format a binary number', () => {
            assert.strictEqual('10', sprintf('%b', 2));
        });

        it('should format a character', () => {
            assert.strictEqual('A', sprintf('%c', 65));
        });

        it('should format a decimal integer', () => {
            assert.strictEqual('2', sprintf('%d', 2));
        });

        it('should format an integer', () => {
            assert.strictEqual('2', sprintf('%i', 2));
        });

        it('should format a decimal integer from a string', () => {
            assert.strictEqual('2', sprintf('%d', '2'));
        });

        it('should format an integer from a string', () => {
            assert.strictEqual('2', sprintf('%i', '2'));
        });

        it('should format a JSON object', () => {
            assert.strictEqual('{"foo":"bar"}', sprintf('%j', { foo: 'bar' }));
        });

        it('should format a JSON array', () => {
            assert.strictEqual('["foo","bar"]', sprintf('%j', ['foo', 'bar']));
        });

        it('should format a number in scientific notation (lowercase)', () => {
            assert.strictEqual('2e+0', sprintf('%e', 2));
        });

        it('should format an unsigned decimal integer', () => {
            assert.strictEqual('2', sprintf('%u', 2));
        });

        it('should format a large unsigned decimal integer from a negative number', () => {
            assert.strictEqual('4294967294', sprintf('%u', -2));
        });

        it('should format a floating-point number', () => {
            assert.strictEqual('2.2', sprintf('%f', 2.2));
        });

        it('should format a number in shortest notation (lowercase)', () => {
            assert.strictEqual('3.141592653589793', sprintf('%g', Math.PI));
        });

        it('should format an octal number', () => {
            assert.strictEqual('10', sprintf('%o', 8));
        });

        it('should format a large octal number from a negative number', () => {
            assert.strictEqual('37777777770', sprintf('%o', -8));
        });

        it('should format a string', () => {
            assert.strictEqual('%s', sprintf('%s', '%s'));
        });

        it('should format a hexadecimal number (lowercase)', () => {
            assert.strictEqual('ff', sprintf('%x', 255));
        });

        it('should format a large hexadecimal number (lowercase) from a negative number', () => {
            assert.strictEqual('ffffff01', sprintf('%x', -255));
        });

        it('should format a hexadecimal number (uppercase)', () => {
            assert.strictEqual('FF', sprintf('%X', 255));
        });

        it('should format a large hexadecimal number (uppercase) from a negative number', () => {
            assert.strictEqual('FFFFFF01', sprintf('%X', -255));
        });

        it('should format arguments by index', () => {
            assert.strictEqual('Polly wants a cracker', sprintf('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants'));
        });

        it('should format arguments by name', () => {
            assert.strictEqual('Hello world!', sprintf('Hello %(who)s!', { who: 'world' }));
        });

        it('should format named and positional arguments', () => {
            assert.strictEqual('Polly wants a cracker', sprintf('%(name)s %s a %s', 'wants', 'cracker', { 'name': 'Polly' }));
        });

        it('should format named and positional (index) arguments', () => {
            assert.strictEqual('Polly wants a cracker', sprintf('%(name)s %2$s a %1$s', 'cracker', 'wants', { 'name': 'Polly' }));
        });

        describe('%t Placeholder (Boolean)', () => {
            it('should format true as "true"', () => {
                assert.strictEqual('true', sprintf('%t', true));
            });

            it('should format true as "t" with precision 1', () => {
                assert.strictEqual('t', sprintf('%.1t', true));
            });

            it('should format the string "true" as "true"', () => {
                assert.strictEqual('true', sprintf('%t', 'true'));
            });

            it('should format the number 1 as "true"', () => {
                assert.strictEqual('true', sprintf('%t', 1));
            });

            it('should format false as "false"', () => {
                assert.strictEqual('false', sprintf('%t', false));
            });

            it('should format false as "f" with precision 1', () => {
                assert.strictEqual('f', sprintf('%.1t', false));
            });

            it('should format an empty string as "false"', () => {
                assert.strictEqual('false', sprintf('%t', ''));
            });

            it('should format the number 0 as "false"', () => {
                assert.strictEqual('false', sprintf('%t', 0));
            });
        });

        describe('%T Placeholder (Type)', () => {
            it('should format undefined as "undefined"', () => {
                assert.strictEqual('undefined', sprintf('%T', undefined));
            });

            it('should format null as "null"', () => {
                assert.strictEqual('null', sprintf('%T', null));
            });

            it('should format a boolean as "boolean"', () => {
                assert.strictEqual('boolean', sprintf('%T', true));
            });

            it('should format a number as "number"', () => {
                assert.strictEqual('number', sprintf('%T', 42));
            });

            it('should format a string as "string"', () => {
                assert.strictEqual('string', sprintf('%T', 'This is a string'));
            });

            it('should format a function as "function"', () => {
                assert.strictEqual('function', sprintf('%T', Math.log));
            });

            it('should format an array as "array"', () => {
                assert.strictEqual('array', sprintf('%T', [1, 2, 3]));
            });

            it('should format an object as "object"', () => {
                assert.strictEqual('object', sprintf('%T', { foo: 'bar' }));
            });

            it('should format a regular expression as "regexp"', () => {
                assert.strictEqual('regexp', sprintf('%T', /<('[^']*'|'[^']*'|[^''>])*>/));
            });
        });

        describe('%v Placeholder (Value)', () => {
            it('should format true as "true"', () => {
                assert.strictEqual('true', sprintf('%v', true));
            });

            it('should format a number as its string representation', () => {
                assert.strictEqual('42', sprintf('%v', 42));
            });

            it('should format a string as itself', () => {
                assert.strictEqual('This is a string', sprintf('%v', 'This is a string'));
            });

            it('should format an array as a comma-separated string', () => {
                assert.strictEqual('1,2,3', sprintf('%v', [1, 2, 3]));
            });

            it('should format an object as "[object Object]"', () => {
                assert.strictEqual('[object Object]', sprintf('%v', { foo: 'bar' }));
            });

            it('should format a regular expression as its string representation', () => {
                assert.strictEqual('/<("[^"]*"|\'[^\']*\'|[^\'">])*>/', sprintf('%v', /<("[^"]*"|'[^']*'|[^'">])*>/));
            });
        });
    });

    describe('Complex Placeholders', () => {
        describe('Sign Formatting', () => {
            it('should format a positive decimal integer without a sign', () => {
                assert.strictEqual('2', sprintf('%d', 2));
            });

            it('should format a negative decimal integer with a minus sign', () => {
                assert.strictEqual('-2', sprintf('%d', -2));
            });

            it('should format a positive decimal integer with a plus sign', () => {
                assert.strictEqual('+2', sprintf('%+d', 2));
            });

            it('should format a negative decimal integer with a minus sign (forced)', () => {
                assert.strictEqual('-2', sprintf('%+d', -2));
            });

            it('should format a positive integer without a sign', () => {
                assert.strictEqual('2', sprintf('%i', 2));
            });

            it('should format a negative integer with a minus sign', () => {
                assert.strictEqual('-2', sprintf('%i', -2));
            });

            it('should format a positive integer with a plus sign', () => {
                assert.strictEqual('+2', sprintf('%+i', 2));
            });

            it('should format a negative integer with a minus sign (forced)', () => {
                assert.strictEqual('-2', sprintf('%+i', -2));
            });

            it('should format a positive float without a sign', () => {
                assert.strictEqual('2.2', sprintf('%f', 2.2));
            });

            it('should format a negative float with a minus sign', () => {
                assert.strictEqual('-2.2', sprintf('%f', -2.2));
            });

            it('should format a positive float with a plus sign', () => {
                assert.strictEqual('+2.2', sprintf('%+f', 2.2));
            });

            it('should format a negative float with a minus sign (forced)', () => {
                assert.strictEqual('-2.2', sprintf('%+f', -2.2));
            });

            it('should format a negative float with a plus sign and precision', () => {
                assert.strictEqual('-2.3', sprintf('%+.1f', -2.34));
            });

            it('should format a negative zero float with a plus sign and precision', () => {
                assert.strictEqual('-0.0', sprintf('%+.1f', -0.01));
            });

            it('should format pi with shortest notation and precision', () => {
                assert.strictEqual('3.14159', sprintf('%.6g', Math.PI));
            });

            it('should format pi with shortest notation and different precision', () => {
                assert.strictEqual('3.14', sprintf('%.3g', Math.PI));
            });

            it('should format pi with shortest notation and another precision', () => {
                assert.strictEqual('3', sprintf('%.1g', Math.PI));
            });

            it('should format a negative number with leading zeros and a plus sign', () => {
                assert.strictEqual('-000000123', sprintf('%+010d', -123));
            });

            it('should format a negative number with custom padding and a plus sign', () => {
                assert.strictEqual('______-123', sprintf('%+\'_10d', -123));
            });

            it('should format multiple floats with different signs', () => {
                assert.strictEqual('-234.34 123.2', sprintf('%f %f', -234.34, 123.2));
            });
        });

        describe('Padding', () => {
            it('should pad a negative number with leading zeros', () => {
                assert.strictEqual('-0002', sprintf('%05d', -2));
            });

            it('should pad a negative integer with leading zeros', () => {
                assert.strictEqual('-0002', sprintf('%05i', -2));
            });

            it('should pad a string with leading spaces', () => {
                assert.strictEqual('    <', sprintf('%5s', '<'));
            });

            it('should pad a string with leading zeros', () => {
                assert.strictEqual('0000<', sprintf('%05s', '<'));
            });

            it('should pad a string with leading underscores', () => {
                assert.strictEqual('____<', sprintf('%\'_5s', '<'));
            });

            it('should pad a string with trailing spaces', () => {
                assert.strictEqual('>    ', sprintf('%-5s', '>'));
            });

            it('should pad a string with trailing zeros (ignored)', () => {
                assert.strictEqual('>0000', sprintf('%0-5s', '>'));
            });

            it('should pad a string with trailing underscores (ignored)', () => {
                assert.strictEqual('>____', sprintf('%\'_-5s', '>'));
            });

            it('should not pad a string longer than the specified width', () => {
                assert.strictEqual('xxxxxx', sprintf('%5s', 'xxxxxx'));
            });

            it('should not pad an unsigned integer beyond its length', () => {
                assert.strictEqual('1234', sprintf('%02u', 1234));
            });

            it('should pad a float with leading spaces and specify precision', () => {
                assert.strictEqual(' -10.235', sprintf('%8.3f', -10.23456));
            });

            it('should format a float and a string with padding', () => {
                assert.strictEqual('-12.34 xxx', sprintf('%f %s', -12.34, 'xxx'));
            });

            it('should format a JSON object with indentation', () => {
                assert.strictEqual('{\n  "foo": "bar"\n}', sprintf('%2j', { foo: 'bar' }));
            });

            it('should format a JSON array with indentation', () => {
                assert.strictEqual('[\n  "foo",\n  "bar"\n]', sprintf('%2j', ['foo', 'bar']));
            });
        });

        describe('Precision', () => {
            it('should format a float with specified precision', () => {
                assert.strictEqual('2.3', sprintf('%.1f', 2.345));
            });

            it('should limit the length of a string with precision', () => {
                assert.strictEqual('xxxxx', sprintf('%5.5s', 'xxxxxx'));
            });

            it('should limit the length of a padded string with precision', () => {
                assert.strictEqual('    x', sprintf('%5.1s', 'xxxxxx'));
            });
        });

        describe('Callbacks', () => {
            it('should format a string using a callback function', () => {
                assert.strictEqual('foobar', sprintf.config().allowComputedValue(true).sprintf('%s', () => { return 'foobar'; }));
            });

            it('should format a float with specified precision using a callback function', () => {
                assert.strictEqual('2.3', sprintf.config().allowComputedValue(true).sprintf('%.1f', () => { return 2.345; }));
            });

            it('should format a JSON object with indentation using a callback function', () => {
                assert.strictEqual('{\n  "foo": "bar"\n}', sprintf.config().allowComputedValue(true).sprintf('%2j', () => { return { foo: 'bar' }; }));
            });

            it('should format a number in shortest notation (lowercase) using a callback function', () => {
                assert.strictEqual('3.141592653589793', sprintf.config().allowComputedValue(true).sprintf('%g', () => { return Math.PI; }));
            });

            it('should format an octal number using a callback function', () => {
                assert.strictEqual('10', sprintf.config().allowComputedValue(true).sprintf('%o', () => { return 8; }));
            });

            it('should format an unsigned decimal integer using a callback function', () => {
                assert.strictEqual('2', sprintf.config().allowComputedValue(true).sprintf('%u', () => { return 2; }));
            });

            it('should format a large unsigned decimal integer from a negative number using a callback function', () => {
                assert.strictEqual('4294967294', sprintf.config().allowComputedValue(true).sprintf('%u', () => { return -2; }));
            });

            it('should format a hexadecimal number (lowercase) using a callback function', () => {
                assert.strictEqual('ff', sprintf.config().allowComputedValue(true).sprintf('%x', () => { return 255; }));
            });

            it('should format a large hexadecimal number (lowercase) from a negative number using a callback function', () => {
                assert.strictEqual('ffffff01', sprintf.config().allowComputedValue(true).sprintf('%x', () => { return -255; }));
            });

            it('should format a hexadecimal number (uppercase) using a callback function', () => {
                assert.strictEqual('FF', sprintf.config().allowComputedValue(true).sprintf('%X', () => { return 255; }));
            });

            it('should format a large hexadecimal number (uppercase) from a negative number using a callback function', () => {
                assert.strictEqual('FFFFFF01', sprintf.config().allowComputedValue(true).sprintf('%X', () => { return -255; }));
            });

            it('should format a large number exceeding 32 bits correctly as a hexadecimal string using a callback function', () => {
                assert.equal('2308249009', sprintf.config().allowComputedValue(true).sprintf('%X', () => { return 150460469257; }));
            });

            it('should format a binary number using a callback function', () => {
                assert.strictEqual('10', sprintf.config().allowComputedValue(true).sprintf('%b', () => { return 2; }));
            });

            it('should format a character using a callback function', () => {
                assert.strictEqual('A', sprintf.config().allowComputedValue(true).sprintf('%c', () => { return 65; }));
            });

            it('should format undefined as "function" using a callback function', () => {
                assert.strictEqual('function', sprintf('%T', () => { return undefined; }));
            });

            it('should format true as "() => { return 42; " using a callback function', () => {
                assert.strictEqual('() => { return 42; }', sprintf('%v', () => { return 42; }));
            });
        });

        describe('Other', () => {
            it('should format a BigInt value correctly as a decimal string', () => {
                assert.equal('9999999999999999999999999999999999999999', sprintf("%d", 9999999999999999999999999999999999999999n));
                assert.equal('9999999999999999999999999999999999999999', sprintf("%i", 9999999999999999999999999999999999999999n));
            });

            it('should treat \'%.f\' as having zero precision for floating-point formatting', () => {
                assert.equal('2', sprintf('%.f', 2));
                assert.equal('2', sprintf('%.0f', 2));
            });

            it('should handle large precision values (e.g., 99) with \'%.f\' without throwing a RangeError', () => {
                assert.equal('1.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', sprintf("%.99f", 1));
            });

            it('should format a large number exceeding 32 bits correctly as a hexadecimal string', () => {
                assert.equal('2308249009', sprintf('%X', 150460469257));
            });

            it('should return 0 when formatting a very small floating-point number as a decimal integer', () => {
                assert.equal(0, sprintf('%d', 9.9999e-7));
            });

            it('should return 0 when formatting a slightly larger small floating-point number as a decimal integer', () => {
                assert.equal(0, sprintf('%d', 9.9999e-7 + 0.0001));
            });

            it('should preserve an unmatched named placeholder when the preserveUnmatchedPlaceholder option is enabled', () => {
                assert.equal('%(name)s number 1', sprintf.config().preserveUnmatchedPlaceholder(true).sprintf('%(name)s number 1'));
            });

            it('should replace an unmatched named placeholder with \'undefined\' by default', () => {
                assert.equal('undefined number 1', sprintf('%(name)s number 1'));
            });

            it('should track named and positional placeholders correctly', () => {
                const config = sprintf.config();
                config.sprintf('%s %s %s %s %(name)s %1$s %2$s');

                assert.deepStrictEqual(config.getStats(), {
                    totalPlaceholders: 7,
                    totalNamedPlaceholder: 1,
                    totalPositionalPlaceholder: 2,
                    totalSequentialPositionalPlaceholder: 4
                });
            });

            it('should track named placeholders correctly', () => {
                const config = sprintf.config();
                config.sprintf('%(firstname)s %(lastname)s');

                assert.deepStrictEqual(config.getStats(), {
                    totalPlaceholders: 2,
                    totalNamedPlaceholder: 2,
                    totalPositionalPlaceholder: 0,
                    totalSequentialPositionalPlaceholder: 0
                });
            });

            it('should track positional placeholders correctly', () => {
                const config = sprintf.config();
                config.sprintf('%1$s %2$s');

                assert.deepStrictEqual(config.getStats(), {
                    totalPlaceholders: 2,
                    totalNamedPlaceholder: 0,
                    totalPositionalPlaceholder: 2,
                    totalSequentialPositionalPlaceholder: 0
                });
            });

            it('should track sequential positional placeholders correctly', () => {
                const config = sprintf.config();
                config.sprintf('%s %s');

                assert.deepStrictEqual(config.getStats(), {
                    totalPlaceholders: 2,
                    totalNamedPlaceholder: 0,
                    totalPositionalPlaceholder: 0,
                    totalSequentialPositionalPlaceholder: 2
                });
            });
        });
    });
});
