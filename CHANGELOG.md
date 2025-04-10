# Change Log

All notable changes to the "@playfulsparkle/sprintf-js" sprintf implementation will be documented in this file.

## [1.0.3] - 2025-04-10

**Change:** Reverted the function as a dynamic value functionality. This version reverts to using `typeof arg === 'function'` for identifying function arguments. This approach is generally considered more secure and reliable in JavaScript for the following reasons:

* **Direct Type Check:** `typeof` directly checks the underlying type of the variable as reported by the JavaScript engine, which is less susceptible to manipulation.
* **Reduced Attack Surface:** By relying on the built-in `typeof` operator, we minimize the risk of unexpected behavior arising from a manipulated prototype chain.

**Security Risk:** Using `instanceof Function` for function detection can be less secure because the prototype chain of an object can be manipulated. In malicious scenarios, an attacker could potentially craft an object that appears to be a function to `instanceof Function` but does not behave as expected, potentially leading to unexpected behavior or even code injection if this "function" is later executed by the `sprintf` implementation.
