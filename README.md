# sprintf.js: Lightweight JavaScript String Formatting Library

A **lightweight** and **open-source JavaScript library** providing a robust **sprintf implementation** for **string formatting** in **JavaScript**. This library offers a familiar syntax for developers accustomed to `sprintf` from other languages like C and PHP, with added features like **positional** and **named placeholders**. It provides an easy solution in both **browser** and **Node.js** environments.

## Usage

## Installation

### NPM

```bash
npm install @playfulsparkle/sprintf-js
```

### Yarn

```bash
yarn add @playfulsparkle/sprintf-js
```

### Bower (deprecated)

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

The `sprintf` function supports a wide range of formatting options. Each placeholder can include optional modifiers to control how the corresponding value is displayed. Below are the supported options in the order they can appear in a format specifier:

**Argument Index (Positional Specifier)**

* **Syntax:** `%<index>$<specifier>` (e.g., `%2$s`)
* **Description:** Specifies which argument to insert at this position, starting from `1`. Useful when you want to change the order of values.
* **Default:** If omitted, arguments are used in the order they appear.
* **Example:**

```javascript
sprintf("%2$s, %1$s!", "Hello", "World"); // will output "World, Hello!"
```

**Sign Indicator**

* **Syntax:** `%+<specifier>` (e.g., `%+d`)
* **Description:** Forces numeric output to always include a sign (`+` or `-`).
* **Default:** Only negative numbers show a sign.
* **Example:**

```javascript
sprintf("%+d", 5);  // will output "+5"
sprintf("%+d", -5); // will output "-5"
```

**Padding Specifier**

* Syntax: `%0<width><specifier>` or `%'<char><width><specifier>` (e.g., `%05d`, `%'*5s`)
* Description: Defines the character used for padding.
    * `0` pads numeric types with leading zeros.
    * `'` followed by a character pads with that character.
* Default padding is with spaces.
* Examples:

```javascript
sprintf("%05d", 12);     // will output "00012"
sprintf("%'*5s", "abc"); // will output "**abc"
```

**Alignment**

* **Syntax:** `%-<width><specifier>` (e.g., `%-10s`)
* **Description:** Aligns the output within the field width.
* `-` aligns left.
* Default is right alignment.
* **Example:**

```javascript
sprintf("%-10s", "hello"); // will output "hello     "
sprintf("%10s", "hello");  // will output "     hello"
```

**Width**

* **Syntax:** `%<number><specifier>` (e.g., `%10s`, `%5j`)
* **Description:** Sets the minimum width of the output. Pads if the actual output is shorter.
    * For the `j` (JSON) specifier, this defines the number of spaces used for indentation.
* **Examples:**

```javascript
sprintf("%10s", "test");  // will output "      test"
sprintf("%5j", { a: 1 }); // will output "{\n     \"a\": 1\n}"
```

Precision

**Syntax:** `%.<number><specifier>` (e.g., `%.2f`, `%.5g`, `%.10s`)
**Description:** Controls output precision, depending on the type:
* `f`, `e`: Number of digits after the decimal point.
* `g`: Total significant digits.
* `s`, `t`, `T`, `v`: Max characters (string is truncated).
**Examples:**

```javascript
sprintf("%.2f", 3.14159);             // will output "3.14"
sprintf("%.5g", 123.45678);           // will output "123.46"
sprintf("%.5s", "This is long text"); // will output "This "
```

### Required Type Specifier

This single character at the end of the placeholder determines how the corresponding argument will be interpreted and formatted.

| Specifier | Description                                           | Example                                     | Output          |
| --------- | ----------------------------------------------------- | ------------------------------------------- | --------------- |
| `%`       | Outputs a literal percent sign.                       | `sprintf('%%')`                             | `%`             |
| `b`       | Integer in binary format.                             | `sprintf('%b', 10)`                         | `1010`          |
| `c`       | Integer as an ASCII character.                        | `sprintf('%c', 65)`                         | `A`             |
| `d` or `i`| Signed decimal integer.                               | `sprintf('%d', 123)`                        | `123`           |
| `e`       | Floating point in scientific notation (lowercase "e") | `sprintf("%e", 123.45)`                     | `1.234500e+02`  |
| `E`       | Floating point in scientific notation (uppercase "E") | `sprintf("%E", 123.45)`                     | `1.234500E+02`  |
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

### Flexible Configuration Options

Our `sprintf` library offers powerful and flexible configuration options to tailor its behavior to your specific needs. You can easily adjust settings like how unmatched placeholders are handled or whether computed values are allowed. This section outlines the various ways you can configure the library.

#### Chainable Configuration

For more control, you can leverage our chainable configuration interface. This allows you to set multiple configuration options in a fluent and readable manner.

**Method 1: Chaining Method Calls**

You can chain configuration methods directly before calling `sprintf()`:

```javascript
const result = sprintf.config()
    .allowComputedValue(true)
    .preserveUnmatchedPlaceholder(true)
    .sprintf("My name is %s and I have %d %s. Today is %s", "John", 5, () => { return 'apple'; });
console.log(result);
// Returns: "My name is John and I have 5 apple. Today is %s"
```

**Method 2: Using a Configuration Object**

Alternatively, you can pass a JavaScript object containing your desired configuration options to the `config()` method:

```javascript
const sprintfConfig = sprintf.config({
    allowComputedValue: true,
    preserveUnmatchedPlaceholder: true
});
const result = sprintfConfig.sprintf("My name is %s and I have %d %s. Today is %s", "John", 5, () => { return 'apple'; });
console.log(result);
// Returns: "My name is John and I have 5 apple. Today is %s"
```

#### Reusing Configurations

One of the key benefits of our configuration system is the ability to create reusable configuration objects. This is particularly useful when you have consistent formatting requirements across different parts of your application.

```javascript
const sprintfConfig = sprintf.config().allowComputedValue(true);

const result1 = sprintfConfig.sprintf("%s", () => { return "test1"; });
console.log(result1);
// Returns: "test1" (with allowComputedValue enabled)

const result2 = sprintfConfig.sprintf("%s", () => { return "test2"; });
console.log(result2);
// Returns: "test2" (using the same configuration)
```

In this example, `sprintfConfig` retains the `allowComputedValue(true)` setting, allowing you to apply it to multiple `sprintf()` calls without repeating the configuration.

#### Analyzing placeholder statistic with getStats()

A new `getStats()` method, accessible through the chainable configuration, allows you to analyze the placeholders in your format strings.

```javascript
const config = sprintf.config();
config.sprintf('%s %s %s %s %(name)s %1$s %2$s');
console.log(config.getStats());
// Returns:
// {
//   totalPlaceholders: 7,
//   totalNamedPlaceholder: 1,
//   totalPositionalPlaceholder: 2,
//   totalSequentialPositionalPlaceholder: 4
// }
```

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

### Named and positional placeholder

`sprintf` offers exceptional flexibility by allowing you to utilize **named placeholders** (like `%(keyword)s`), **numbered positional placeholders** (such as `%1$s`, `%2$s`), and **sequential positional placeholders** (represented by `%s`). This comprehensive support enables you to choose the most appropriate style, or even combine them for complex formatting scenarios, enhancing both readability and maintainability.

* Basic usage:

__Example:__

```javascript
const data = {
    'name': 'Polly'
};
sprintf('%(name)s %2$s a %1$s', 'cracker', 'wants', data);
// Returns: "Polly wants a cracker"
```

### Leveraging `preserveUnmatchedPlaceholder` functionality

You can use the `preserveUnmatchedPlaceholder` option to perform multi-stage string formatting with `sprintf`. This allows you to initially apply a subset of data, leaving unmatched placeholders in place to be filled in later.

```javascript
const sprintfConfig = sprintf.config({ preserveUnmatchedPlaceholder: true });
const firstPass = sprintfConfig.sprintf('My name is %(firstname)s %(lastname)s', { lastname: 'Doe' });
console.log(firstPass); // Returns: My name is %(firstname)s Doe
console.log(sprintfConfig.sprintf(firstPass, { firstname: 'John' })) // Returns: My name is John Doe
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
