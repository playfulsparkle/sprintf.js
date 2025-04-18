const { sprintf } = require('./sprintf');

console.log(sprintf('%e', 123.45)); // 1.234500e+02
console.log(sprintf('%E', 123.45)); // 1.234500E+02
