/*! @playfulsparkle/sprintf-js v1.1.0 | Copyright (c) 2025-present, Zsolt Oroszlány <hello@playfulsparkle.com> | BSD-3-Clause */
const { sprintf } = require('./sprintf');

console.log(sprintf('%e', 123.45)); // 1.234500e+02
console.log(sprintf('%E', 123.45)); // 1.234500E+02
