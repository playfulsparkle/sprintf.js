# sprintf.js: Lightweight JavaScript String Formatting Library

A **lightweight** and **open-source JavaScript library** providing a robust **sprintf implementation** for **string formatting** in **JavaScript**. This library offers a familiar syntax for developers accustomed to `sprintf` from other languages like C and PHP, with added features like **positional** and **named placeholders**. It provides an easy solution in both **browser** and **Node.js** environments.

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

The `sprintf` function is the main formatting function, similar to the `sprintf` function found in C-like languages. It takes a format string and a variable number of arguments to be inserted into the string at specified placeholders.

***Parameters:***

* `format` (String): The format string. This string contains plain text and zero or more format specifiers (placeholders).
* `...args`: One or more values that will be formatted and inserted into the `format` string according to the format specifiers.

***Return Value:***

* (String): The formatted string.

```
string sprintf(string format, mixed arg1?, mixed arg2?, ...)
```

### `vsprintf`

The `vsprintf` function is a version of sprintf that accepts the arguments to be formatted as an array.

***Parameters:***

* `format` (String): The format string, identical to the `format` parameter in `sprintf`.
* `argv` (Array): An array containing the values to be formatted and inserted into the `format` string.

***Return Value:***

* (String): The formatted string.

```
string vsprintf(string format, array argv)
```

### Difference between `sprintf` and `vsprintf`

The main difference is how they receive the values to be formatted: `sprintf` takes them as individual arguments after the format string, while `vsprintf` takes them as a single array argument. `vsprintf` is useful when the arguments are already in an array.

## Format String Placeholders

The `sprintf` function uses placeholders within the format string (the first argument) to indicate where and how subsequent arguments should be inserted and formatted. Placeholders begin with a `%` character and are followed by a sequence of optional formatting options and a required type specifier. This powerful system allows for precise control over the output format of your strings.

### Optional Formatting Elements

These elements can appear in a placeholder in a specific order between the `%` and the type specifier.

1.  **Argument Index (Positional Specifier)**:
    * **Syntax:** A number (starting from 1) followed by a `$` (e.g., `%2$s`).
    * **Description:** Explicitly selects which argument to use for the current placeholder. If omitted, arguments are used sequentially in the order they are provided to `sprintf`.
    * **Example:** `sprintf('%2$s, %1$s!', 'Hello', 'World')` will output `"World, Hello!"`.

2.  **Sign Indicator**:
    * **Syntax:** A `+` character (e.g., `%+d`).
    * **Description:** Forces numeric values (integers and floats) to always display a sign, either `+` for positive numbers or `-` for negative numbers. By default, only negative numbers show a sign.
    * **Example:** `sprintf('%+d', 5)` will output `"+5"`, and `sprintf('%+d', -5)` will output `"-5"`.

3.  **Padding Specifier**:
    * **Syntax:** Either a `0` or a single quote `'` followed by any character (e.g., `%05d`, `%'*5s`).
    * **Description:** Specifies the character used for padding the output to reach the desired width.
        * Using `0` pads with leading zeros for numeric types.
        * Using `'` followed by a character pads with that specific character.
    * **Examples:**
        * `sprintf('%05d', 12)` will output `"00012"`.
        * `sprintf("%'*5s", 'abc')` will output `"**abc"`.

4.  **Alignment**:
    * **Syntax:** A `-` character (e.g., `%-10s`).
    * **Description:** Aligns the output to the left within the specified field width. If the `-` is omitted, the output is right-aligned by default.
    * **Example:** `sprintf('%-10s', 'hello')` will output `"hello     "`, and `sprintf('%10s', 'hello')` will output `"     hello"`.

5.  **Width**:
    * **Syntax:** A positive integer (e.g., `%10s`, `%5j`).
    * **Description:** Specifies the minimum number of characters to output. If the value to be formatted is shorter than the width, it will be padded (using the padding character and alignment). For the `j` (JSON) type, this number defines the indentation level (number of spaces).
    * **Examples:**
        * `sprintf('%10s', 'test')` will output `"      test"`.
        * `sprintf('%5j', { a: 1 })` will output `"{\n     "a": 1\n}"`.

6.  **Precision**:
    * **Syntax:** A period `.` followed by a non-negative integer (e.g., `%.2f`, `%.5g`, `%.10s`).
    * **Description:** Controls the precision of the output depending on the type specifier:
        * For floating-point types (`e`, `f`): Specifies the number of digits to appear after the decimal point.
        * For the `g` type: Specifies the number of significant digits.
        * For the `s`, `t`, `T`, and `v` types: Specifies the maximum number of characters to output (truncates the string if it's longer).
    * **Examples:**
        * `sprintf('%.2f', 3.14159)` will output `"3.14"`.
        * `sprintf('%.5g', 123.45678)` will output `"123.46"`.
        * `sprintf('%.5s', 'This is a long string')` will output `"This "`.

### Required Type Specifier

This single character at the end of the placeholder determines how the corresponding argument will be interpreted and formatted.

| Specifier | Description                                           | Example                                     | Output          |
| --------- | ----------------------------------------------------- | ------------------------------------------- | --------------- |
| `%`       | Outputs a literal percent sign.                       | `sprintf('%%')`                             | `%`             |
| `b`       | Integer in binary format.                             | `sprintf('%b', 10)`                         | `1010`          |
| `c`       | Integer as an ASCII character.                        | `sprintf('%c', 65)`                         | `A`             |
| `d` or `i`| Signed decimal integer.                               | `sprintf('%d', 123)`                        | `123`           |
| `e`       | Floating point in scientific notation.                | `sprintf('%e', 123.45)`                     | `1.2345e+2`     |
| `u`       | Unsigned decimal integer.                             | `sprintf('%u', -5)`                         | `4294967291`    |
| `f`       | Floating point as-is (with optional precision).       | `sprintf('%.2f', 3.14159)`                  | `3.14`          |
| `g`       | Floating point with adaptive formatting.              | `sprintf('%.3g', 1234.56)`                  | `1.23e+3`       |
| `o`       | Integer in octal format.                              | `sprintf('%o', 10)`                         | `12`            |
| `s`       | String output.                                        | `sprintf('%s', 'hello')`                    | `hello`         |
| `t`       | Boolean (`"true"` or `"false"`).                      | `sprintf('%t', true)`                       | `true`          |
| `T`       | Data type of the argument (lowercase).                | `sprintf('%T', [])`                         | `array`         |
| `v`       | Primitive value of the argument (using `valueOf()`).  | `sprintf('%v', new Number(5))`              | `5`             |
| `x`       | Integer in lowercase hexadecimal.                     | `sprintf('%x', 255)`                        | `ff`            |
| `X`       | Integer in uppercase hexadecimal.                     | `sprintf('%X', 255)`                        | `FF`            |
| `j`       | JavaScript object or array in JSON format.            | `sprintf('%j', { a: 1, b: 2 })`             | `{"a":1,"b":2}` |

## Features

### Flexible Argument Order

You can specify the order of values in the formatted string independently from how they are provided. By adding a number (like `%1$s`, `%2$s`) to the placeholder, you control which value is used and in which position. This also allows reusing the same value multiple times without passing it again. This feature enhances the flexibility and readability of your code.

__Example:__

```javascript
sprintf('%2$s is %1$s years old and loves %3$s', 25, 'John', 'basketball')
// Returns: "John is 25 years old and loves basketball"
```

Here, `%2$s` refers to the second argument (`John`), `%3$s` to the third (`basketball`), and `%1$s` to the first (`25`).

### Named Placeholders

Instead of using numbers, you can reference values by their names using objects. Placeholders are wrapped in parentheses, like `%(keyword)s`, where `keyword` matches a key in the provided object. This makes the code more readable and works with nested data, improving the maintainability of your string formatting logic.

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

### Computed values

To generate values dynamically, you can supply a function. This function will be invoked without arguments, and its return value will be treated as the computed value.

We have exposed the `allowComputedValue` property, which allows you to enable or disable this functionality. If you intend to use `sprintf` with function arguments for dynamic values, you must explicitly enable this feature by setting `sprintf.allowComputedValue = true`. This functionality is disabled by default due to potential security concerns.

**Security Consideration:**

Enabling computed values introduces a risk if the format string or the arguments passed to `sprintf` come from an untrusted source. For example, a malicious actor could potentially inject a format string with a placeholder that triggers the execution of a function they also control.

**Example of Potential Risk:**

While this is a simplified illustration, imagine a scenario where user input could influence the arguments passed to `sprintf`:

```javascript
// WARNING: Enabling computed values with untrusted input is risky!
sprintf.allowComputedValue = true;

let userInput = '%s'; // Could be controlled by a malicious user

let maliciousFunction = () => {
  // In a real scenario, this could perform harmful actions
  console.log('Malicious function executed!');
  return 'dangerous output';
};

let formattedString = sprintf(userInput, maliciousFunction);

console.log(formattedString); // Output: "dangerous output"
```

In this example, if `userInput` was crafted to include `%s` and a malicious function was somehow passed as an argument, enabling `allowComputedValue` would lead to the execution of that function.

**Example (Safe Usage):**

When using computed values with trusted input:

```javascript
sprintf.allowComputedValue = true;

sprintf('Current date and time: %s', function() { return new Date().toString(); })
// Returns: "Current date and time: Thu Apr 10 2025 13:25:07 GMT+0200 (Central European Summer Time)"
```

Remember to enable `sprintf.allowComputedValue = true;` only when you are certain about the safety and origin of the format string and its arguments.

## Support

### Node.js

`sprintf.js` runs in all active Node versions (4+).

### Browser Support

This library is written using modern ECMAScript 2015 (ES6) features. It is expected to work in the following browser versions and later:

| Browser                  | Minimum Supported Version |
| ------------------------ | ------------------------- |
| **Desktop Browsers**     |                           |
| Chrome                   | 1                         |
| Edge                     | 12                        |
| Firefox                  | 1                         |
| Opera                    | 5                         |
| Safari                   | 1                         |
| **Mobile Browsers**      |                           |
| Chrome Android           | 18                        |
| Firefox for Android      | 4                         |
| Opera Android            | 10.1                      |
| Safari on iOS            | 1                         |
| Samsung Internet         | 1                         |
| WebView Android          | 4.4                       |
| WebView on iOS           | 1                         |
| **Other**                |                           |
| Node.js                  | 0.10                      |

## License

**sprintf.js** is licensed under the terms of the BSD 3-Clause License.
