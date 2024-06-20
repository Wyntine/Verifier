import { error, fail, isNumber, success } from "../utils/verify.js";
import { BaseVerifier } from "./BaseVerifier.js";
import { replace } from "../utils/strings.js";
import {
  ItemTypes,
  VerifierContext,
  VerifierCheckData,
  VerifierFunctionOutput,
} from "../types/general.js";
import { AllowedSigns, NumberRange } from "../types/verifiers/number.js";

export class NumberVerifier extends BaseVerifier<ItemTypes.Number> {
  constructor(verifierContext?: VerifierContext<ItemTypes.Number>) {
    super(
      [
        checkNumber,
        checkIntegerType,
        checkExpectedValue,
        checkAllowedSigns,
        checkValues,
        checkRanges,
        checkDividableNumbers,
      ],
      verifierContext,
    );
  }

  public setExpectedNumber(expectedNumber: number) {
    return new NumberVerifier({ ...this.data, expectedNumber });
  }

  public setMinValue(minValue: number) {
    return new NumberVerifier({ ...this.data, minValue });
  }

  public setMaxValue(maxValue: number) {
    return new NumberVerifier({ ...this.data, maxValue });
  }

  //TODO: Delayed to future update because of instability of the check.

  // public setMinLength(minLength: number) {
  //   return new NumberVerifier({ ...this.data, minLength });
  // }

  // public setMaxLength(maxLength: number) {
  //   return new NumberVerifier({ ...this.data, maxLength });
  // }

  // public setLength(length: number) {
  //   return new NumberVerifier({ ...this.data, length });
  // }

  public setSafeIntegerOnly(safeInteger: boolean) {
    return new NumberVerifier({ ...this.data, safeInteger });
  }

  public setIntegerOnly(integer: boolean) {
    return new NumberVerifier({ ...this.data, integer });
  }

  public setAllowedSigns({
    positive = true,
    zero = true,
    negative = true,
  }: AllowedSigns = {}) {
    return new NumberVerifier({ ...this.data, positive, zero, negative });
  }

  public addAllowedRanges(allowedRanges: NumberRange[]) {
    const currentRanges = this.data.allowedRanges ?? [];
    return new NumberVerifier({
      ...this.data,
      allowedRanges: [...currentRanges, ...allowedRanges],
    });
  }

  public setAllowedRanges(allowedRanges: NumberRange[]) {
    return new NumberVerifier({ ...this.data, allowedRanges });
  }

  public addExcludedRanges(excludedRanges: NumberRange[]) {
    const currentRanges = this.data.excludedRanges ?? [];
    return new NumberVerifier({
      ...this.data,
      excludedRanges: [...currentRanges, ...excludedRanges],
    });
  }

  public setExcludedRanges(excludedRanges: NumberRange[]) {
    return new NumberVerifier({ ...this.data, excludedRanges });
  }

  public setDividableNumbers(dividableBy: number[]) {
    return new NumberVerifier({ ...this.data, dividableBy });
  }
}

function checkNumber(
  this: VerifierCheckData<ItemTypes.Number>,
  input: unknown,
): VerifierFunctionOutput {
  const { not } = this.lang.errors.number;

  return isNumber(input) ? success() : fail(not);
}

function checkExpectedValue(
  this: VerifierCheckData<ItemTypes.Number>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isNumber(input)) return success();

  const { lang, data } = this;
  const { expectedNumber } = data;

  if (!isNumber(expectedNumber)) return success();

  const { notEqual } = lang.errors.number;

  return input === expectedNumber ? success() : (
      error(replace(notEqual, [input, expectedNumber]))
    );
}

function checkAllowedSigns(
  this: VerifierCheckData<ItemTypes.Number>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isNumber(input)) return success();

  const { lang, data } = this;
  const { positive, negative, zero } = data;

  if ([positive, negative, zero].every((item) => item === undefined))
    return success();

  const { signs } = lang.errors.number;

  if (positive === false && input > 0)
    return error(replace(signs.positive, [input]));
  if (negative === false && input < 0)
    return error(replace(signs.negative, [input]));
  if (zero === false && input === 0) return error(replace(signs.zero, [input]));

  return success();
}

function checkValues(
  this: VerifierCheckData<ItemTypes.Number>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isNumber(input)) return success();

  const { lang, data } = this;
  const { minValue, maxValue } = data;

  const isMin = isNumber(minValue);
  const isMax = isNumber(maxValue);

  if (!isMin && !isMax) return success();

  const { min, max, maxLower } = lang.errors.number.values;

  if (isMin && isMax && minValue > maxValue) return fail(maxLower);

  if (isMin && minValue > input) return error(replace(min, [input, minValue]));
  if (isMax && maxValue < input) return error(replace(max, [input, maxValue]));

  return success();
}

//* Safe integer limit: ±9_007_199_254_740_991

function checkIntegerType(
  this: VerifierCheckData<ItemTypes.Number>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isNumber(input)) return success();

  const { lang, data } = this;
  const { safeInteger, integer } = data;
  const { notSafe, notInteger } = lang.errors.number.integers;

  if (integer && !Number.isInteger(input))
    return error(replace(notInteger, [input]));
  if (safeInteger && !Number.isSafeInteger(input))
    return error(replace(notSafe, [input]));

  return success();
}

function checkRanges(
  this: VerifierCheckData<ItemTypes.Number>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isNumber(input)) return success();

  const { lang, data } = this;
  const { allowedRanges = [], excludedRanges = [] } = data;

  if (![...allowedRanges, ...excludedRanges].length) return success();

  const { excluded, notInAllowed, endLower } = lang.errors.number.ranges;

  for (const { start, end } of excludedRanges) {
    if (start.number >= end.number) return fail(endLower);

    const isHigher =
      start.included ? start.number <= input : start.number < input;

    const isLower = end.included ? end.number >= input : end.number > input;

    const startTag = start.included ? "[" : "(";
    const endTag = end.included ? "]" : ")";

    if (isHigher && isLower)
      return error(
        replace(excluded, [input, startTag, start.number, end.number, endTag]),
      );
  }

  if (!allowedRanges.length) return success();

  for (const { start, end } of allowedRanges) {
    if (start.number >= end.number) return fail(endLower);

    const isHigher =
      start.included ? start.number <= input : start.number < input;

    const isLower = end.included ? end.number >= input : end.number > input;

    if (isHigher && isLower) return success();
  }

  return error(replace(notInAllowed, [input]));
}

function checkDividableNumbers(
  this: VerifierCheckData<ItemTypes.Number>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isNumber(input)) return success();

  const { lang, data } = this;
  const { dividableBy = [] } = data;

  if (!dividableBy.length) return success();

  const { zero, cannot } = lang.errors.number.dividable;

  if (dividableBy.includes(0)) return fail(zero);

  const failed = dividableBy.filter((item) => input % item !== 0);

  if (!failed.length) return success();

  return error(replace(cannot, [input, failed.join(", ")]));
}

//! Delayed to future update because of instability of the check.

// function checkLengths(
//   this: VerifierCheckData<ItemTypes.Number>,
//   input: unknown
// ): VerifierFunctionOutput {
//   if (!isNumber(input)) return error();

//   const { lang, data } = this;
//   const { maxLength, minLength, length } = data;
//   const isMax = isNumber(maxLength);
//   const isMin = isNumber(minLength);
//   const isLen = isNumber(length);

//   const inputLength = input.toString().length;

//   const {
//     errors: {
//       string: {
//         lengths: { both, min, max, notEqual },
//       },
//     },
//   } = lang;

//   if (!isMax && !isMin && !length) return success();
//   if ((isMax || isMin) && isLen) return fail(both);
//   if (isLen && length !== input.length)
//     return error(replace(notEqual, [input, input.length, length]));

//   if (isMax) {
//     if (!Number.isInteger(maxLength)) return fail(max.integer);
//     if (maxLength < 0) return fail(max.negative);
//     if (maxLength < (minLength ?? 0)) return fail(max.lower);
//   }

//   if (isMin) {
//     if (!Number.isInteger(minLength)) return fail(min.integer);
//     if (minLength < 0) return fail(min.negative);
//   }

//   if (isMax && maxLength < input.length)
//     return error(replace(max.more, [input, input.length, maxLength]));
//   if (isMin && minLength > input.length)
//     return error(replace(min.less, [input, input.length, minLength]));

//   return success();
// }
