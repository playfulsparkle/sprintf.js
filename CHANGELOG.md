# Change Log

All notable changes to the "@playfulsparkle/sprintf-js" sprintf implementation will be documented in this file.

## [1.0.7] - 2025-04-12

* **Feature:** Ensured that an empty precision (e.g., `%.f`) defaults to a precision of zero, aligning with standard formatting conventions.
* **Feature:** Correctly implemented the formatting of `BigInt` values as decimal strings.
* **Fix:** When `allowComputedValue` was false and a function was passed as an argument to `sprintf` (e.g., `sprintf('%s', () => { return 'foobar'; })`), the function's string representation was incorrectly used as the output value for the placeholder. This issue has been resolved, ensuring that even when `allowComputedValue` is false, functions are not directly converted to strings for substitution, preventing unexpected behavior with different placeholder types like `%s` or `%d` (which would have likely resulted in 0).

## [1.0.6] - 2025-04-12

A new `getStats()` method is now available via the chainable configuration. First, configure using `sprintf.config()`, then apply your format string using the `.sprintf()` method on the configuration object. Finally, calling `.getStats()` on the same configuration object will return an object detailing the placeholder usage, including counts for total, named, positional, and sequential positional placeholders. This allows for programmatic analysis of your format strings.

## [1.0.5] - 2025-04-11

* This release introduces a more flexible and powerful chainable configuration API, replacing the previous individual configuration options (`allowComputedValue`, `throwErrorOnUnmatched`, `preserveUnmatchedPlaceholder`). The new system allows for granular control and reusability of formatting settings through a fluent interface. Please refer to the documentation for details on the new configuration methods.

## [1.0.4] - 2025-04-11

* **Added `allowComputedValue` option:** This feature enables the use of function return values as arguments during string formatting.
* **Added `throwErrorOnUnmatched` option:** When enabled, this option will raise a `SyntaxError` if a placeholder in the format string does not have a corresponding defined argument value.
* **Added `preserveUnmatchedPlaceholder` option:** This option allows the format string to retain any placeholders (such as `%(name)s`, `%1$s`, or `%s`) for which no matching argument is provided.
* **Fix:** Corrected integer formatting (`%d`) for small floating-point numbers with exponents (e.g., `9.9999e-7` now correctly outputs `0`).
* **Fix:** Improved hexadecimal formatting (`%x`, `%X`) for numbers exceeding 32-bit. Enhanced handling for large integers via `BigInt` and objects with a `high` property, ensuring accurate conversion.

## [1.0.3] - 2025-04-10

**Change:** Reverted the function as a dynamic value functionality. This version reverts to using `typeof arg === 'function'` for identifying function arguments. This approach is generally considered more secure and reliable in JavaScript for the following reasons:

* **Direct Type Check:** `typeof` directly checks the underlying type of the variable as reported by the JavaScript engine, which is less susceptible to manipulation.
* **Reduced Attack Surface:** By relying on the built-in `typeof` operator, we minimize the risk of unexpected behavior arising from a manipulated prototype chain.

**Security Risk:** Using `instanceof Function` for function detection can be less secure because the prototype chain of an object can be manipulated. In malicious scenarios, an attacker could potentially craft an object that appears to be a function to `instanceof Function` but does not behave as expected, potentially leading to unexpected behavior or even code injection if this "function" is later executed by the `sprintf` implementation.
