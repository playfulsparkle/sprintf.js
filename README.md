# sprintf.js
A lightweight, Open Source sprintf.js sprintf implementation written in JavaScript

## Usage

## Installation

### NPM
```bash
    npm install @playfulsparkle/sprintf-js
```

### Bower
```bash
    bower install playfulsparkle/sprintf.js
```

## API

### `sprintf`

Returns a formatted string:

### `vsprintf`

Similar to `sprintf`, but it accepts an array of arguments instead of a variadic list.

## Format String Placeholders

Placeholders in the format string are denoted by `%` and must follow a specific sequence of optional and required elements:

### Optional Elements:
- **Argument Index**: A number followed by `$` selects a specific argument to use. If omitted, arguments are used in order.
- **Sign Indicator**: A `+` forces numeric values to include a `+` or `-` sign. By default, only negative numbers show `-`.
- **Padding Specifier**: Defines the padding character, either `0` or a character prefixed with `'`. By default, spaces are used.
- **Alignment**: A `-` aligns output to the left; otherwise, the result is right-aligned.
- **Width**: Specifies the minimum output length. If shorter, padding is applied. For the `j` (JSON) type, it defines indentation size.
- **Precision**: A `.` followed by a number controls decimal precision for floating points, significant digits for `g`, or truncation for strings.

### Required Element:
- **Type Specifier**: Determines how the value is formatted:

  - `%` - Outputs a literal `%`
  - `b` - Integer in binary format
  - `c` - Integer as an ASCII character
  - `d` or `i` - Signed decimal integer
  - `e` - Floating point in scientific notation
  - `u` - Unsigned decimal integer
  - `f` - Floating point as-is
  - `g` - Floating point with adaptive formatting
  - `o` - Integer in octal format
  - `s` - String output
  - `t` - Boolean (`true` or `false`)
  - `T` - Data type of the argument
  - `v` - Primitive value of the argument
  - `x` - Integer in lowercase hexadecimal
  - `X` - Integer in uppercase hexadecimal
  - `j` - JavaScript object or array in JSON format

## Features

### Flexible Argument Order

You can specify the order of values in the formatted string independently from how they are provided. By adding a number (like `%1$s`, `%2$s`) to the placeholder, you control which value is used and in which position. This also allows reusing the same value multiple times without passing it again.

__Example:__

```javascript
sprintf('%2$s is %1$s years old and loves %3$s', 25, 'John', 'basketball')
// Returns: "John is 25 years old and loves basketball"
```

Here, `%2$s` refers to the second argument (`John`), `%3$s` to the third (`basketball`), and `%1$s` to the first (`25`).

### Named Placeholders

Instead of using numbers, you can reference values by their names using objects. Placeholders are wrapped in parentheses, like `%(keyword)s`, where `keyword` matches a key in the provided object. This makes the code more readable and works with nested data.

* Basic usage:

__Example:__

```javascript
const userObj = {
    name: 'John'
};
sprintf('Hello %(name)s', userObj);
// Returns: "Hello John"
```

* Nested data (arrays/objects):

__Example:__

```javascript
const data = {
  users: [
    { name: 'Jane' },
    { name: 'Jack' }
  ]
};
sprintf('Hello %s, %(users[0].name)s, and %(users[1].name)s', 'John', data);
// Returns: "Hello John, Jane, and Jack"
```

### Dynamic Values Using Functions

To include values that may change when the string is created (e.g., current time), you can provide a function. The function is automatically executed to generate the final value.

__Example:__

```javascript
sprintf('Today is: %s', new Date().toString());
// Returns "Today is: Mon Mar 24 2025 12:34:56 GMT+0000"
```

Here, the `function () => new Date().toString()` is called when the string is formatted, ensuring the latest date is shown.

## Support

### Node.js

`sprintf.js` runs in all active Node versions (6.x+).

### Browser Support

This library is written using modern JavaScript ES2015 (ES6) features. It is expected to work in the following browser versions and later:

| Browser                  | Minimum Supported Version |
|--------------------------|---------------------------|
| **Desktop Browsers**     |                           |
| Chrome                   | 49                        |
| Edge                     | 13                        |
| Firefox                  | 45                        |
| Opera                    | 36                        |
| Safari                   | 14.1                      |
| **Mobile Browsers**      |                           |
| Chrome Android           | 49                        |
| Firefox for Android      | 45                        |
| Opera Android            | 36                        |
| Safari on iOS            | 14.5                      |
| Samsung Internet         | 5.0                       |
| WebView Android          | 49                        |
| WebView on iOS           | 14.5                      |
| **Other**                |                           |
| Node.js                  | 6.13.0                    |

## License

**sprintf.js** is licensed under the terms of the BSD 3-Clause License.
