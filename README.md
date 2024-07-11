# Verifier

This library provides a set of verifier classes designed to validate different data types such as strings, numbers, arrays, objects, and booleans. Each verifier allows you to set specific validation criteria and perform checks on input data.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [StringVerifier](#stringverifier)
  - [NumberVerifier](#numberverifier)
  - [ArrayVerifier](#arrayverifier)
  - [ObjectVerifier](#objectverifier)
  - [BooleanVerifier](#booleanverifier)
- [Classes](#classes)
- [Enums](#enums)
- [Functions](#functions)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install this library via your package manager:

```bash
npm install @wyntine/verifier
```

```bash
pnpm install @wyntine/verifier
```

```bash
yarn install @wyntine/verifier
```

# Usage

## StringVerifier

Validates input strings based on various criteria such as length, regex pattern, and expected value.

### Methods

- `setLength(length: number)`: Sets the exact length that the string should have.
- `setMaxLength(maxLength: number)`: Sets the maximum length allowed for the string.
- `setMinLength(minLength: number)`: Sets the minimum length required for the string.
- `setRegex(regex: RegExp)`: Sets a regular expression pattern that the string should match.
- `setExpectedString(expectedString: string)`: Sets the expected value that the string should equal to.

## NumberVerifier

Validates input numbers based on criteria such as value range, divisibility, and integer type.

### Methods

- `setExpectedNumber(expectedNumber: number)`: Sets the expected number value.
- `setMinValue(minValue: number)`: Sets the minimum allowed value for the number.
- `setMaxValue(maxValue: number)`: Sets the maximum allowed value for the number.
- `setSafeIntegerOnly(safeInteger: boolean)`: Sets whether the number should be a safe integer.
- `setIntegerOnly(integer: boolean)`: Sets whether the number should be an integer only.
- `setAllowedSigns({ positive, zero, negative }: AllowedSigns)`: Sets which signs (positive, zero, negative) are allowed for the number.
- `setAllowedRanges(allowedRanges: NumberRange[])`: Sets the allowed ranges of numbers.
- `setExcludedRanges(excludedRanges: NumberRange[])`: Sets the excluded ranges of numbers.
- `setDividableNumbers(dividableBy: number[])`: Sets the numbers by which the input number should be divisible.

## ArrayVerifier

Validates input arrays, checking their structure, length, items, and exactness.

### Methods

- `setMaxLength(maxLength: number)`: Sets the maximum length allowed for the array.
- `setMinLength(minLength: number)`: Sets the minimum length required for the array.
- `setLength(length: number)`: Sets the exact length that the array should have.
- `setExact(exact: boolean)`: Sets whether the array should match exactly.
- `addString(data?)`: Adds a string item validator to the array verifier.
- `addBoolean(data?)`: Adds a boolean item validator to the array verifier.
- `addNumber(data?)`: Adds a number item validator to the array verifier.
- `addArray(data?)`: Adds an array item validator to the array verifier.
- `addObject(data?)`: Adds an object item validator to the array verifier.

## ObjectVerifier

Validates input objects, checking their keys, items, allowed/not allowed keys, and exactness.

### Methods

- `setExact(exact: boolean)`: Sets whether the object should match exactly.
- `setGeneralType(verifierType, verifierData)`: Sets a general type validator for the object.
- `setNotAllowedKeys(keys: string[])`: Sets the keys that are not allowed in the object.
- `addNotAllowedKeys(keys: string[])`: Adds additional keys to the list of not allowed keys.
- `addString(key: string, data?)`: Adds a string item validator to the object verifier under the specified key.
- `addBoolean(key: string, data?)`: Adds a boolean item validator to the object verifier under the specified key.
- `addNumber(key: string, data?)`: Adds a number item validator to the object verifier under the specified key.
- `addArray(key: string, data?)`: Adds an array item validator to the object verifier under the specified key.
- `addObject(key: string, data?)`: Adds an object item validator to the object verifier under the specified key.

## BooleanVerifier

Validates input booleans, checking if they match the expected boolean value.

### Methods

- `setExpectedBoolean(expectedBoolean: boolean)`: Sets the expected boolean value.

## Enums

- `VerifierOutputType`: Represents the result of verification operations.
  - Keys: `Success`, `Fail`, `Error`
- `ItemTypes`: Enum defining data types used in verification.
  - Keys: `String`, `Number`, `Boolean`, `Array`, `Object`

## Functions

- `setLang(lang: "tr" | "en")`: Sets the language for error messages during verification.
- `isString(input)`: Checks if the input is a string.
- `isNumber(input)`: Checks if the input is a number.
- `isBoolean(input)`: Checks if the input is a boolean.
- `isArray(input)`: Checks if the input is an array.
- `isObject(input)`: Checks if the input is an object.

# Examples

**Note**: Verifier classes does not mutate itself on actions, they return a new class.

```typescript
import { StringVerifier, NumberVerifier } from "@wyntine/verifier";

const stringValidator = new StringVerifier().setMaxLength(10).setRegex(/^\d+$/);

const numberValidator = new NumberVerifier()
  .setMinValue(0)
  .setMaxValue(100)
  .setDividableNumbers([2, 5]);

const stringResult = stringValidator.verify("12345");
console.log(stringResult); // Output: { status: 'success' }

const numberResult = numberValidator.verify(50);
console.log(numberResult); // Output: { status: 'success' }
```

# Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

# License

This library is licensed under the MIT License.
