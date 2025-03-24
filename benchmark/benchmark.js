const Benchmark = require('benchmark'),
    suite = new Benchmark.Suite,
    sprintfjs = require('../src/sprintf.js'),
    { sprintf } = sprintfjs;

suite
    .add('%8d', () => {
        sprintf('%8d', 12345);
    })
    .add('%08d', () => {
        sprintf('%08d', 12345);
    })
    .add('%2d', () => {
        sprintf('%2d', 12345);
    })
    .add('%8s', () => {
        sprintf('%8s', 'abcde');
    })
    .add('%+010d', () => {
        sprintf('%+010d', 12345);
    });

module.exports = suite;
