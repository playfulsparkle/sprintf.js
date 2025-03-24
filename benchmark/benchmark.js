const Benchmark = require('benchmark'),
    suite = new Benchmark.Suite,
    sprintfjs = require('../src/sprintf.js'),
    { sprintf } = sprintfjs;

module.exports = suite;
