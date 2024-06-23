import {
  ItemTypes,
  VerifierContext,
  VerifierCheckData,
  VerifierFunctionOutput,
} from "../types/general.js";
import { replace } from "../utils/strings.js";
import { isNumber, isString, error, fail, success } from "../utils/verify.js";
import { BaseVerifier } from "./BaseVerifier.js";

/**
 * Verifier for string values.
 */
export class StringVerifier extends BaseVerifier<ItemTypes.String> {
  /**
   * Constructor for StringVerifier.
   * @param verifierContext Optional context for the verifier.
   */
  constructor(verifierContext?: VerifierContext<ItemTypes.String>) {
    super(
      [checkString, checkExpectedString, checkLengths, checkRegex],
      verifierContext,
    );
  }

  /**
   * Sets the exact length of the string.
   * @param length The exact length to set.
   * @returns A new StringVerifier instance with updated length.
   */
  public setLength(length: number) {
    return new StringVerifier({ ...this.data, length });
  }

  /**
   * Sets the maximum length of the string.
   * @param maxLength The maximum length to set.
   * @returns A new StringVerifier instance with updated maxLength.
   */
  public setMaxLength(maxLength: number) {
    return new StringVerifier({ ...this.data, maxLength });
  }

  /**
   * Sets the minimum length of the string.
   * @param minLength The minimum length to set.
   * @returns A new StringVerifier instance with updated minLength.
   */
  public setMinLength(minLength: number) {
    return new StringVerifier({ ...this.data, minLength });
  }

  /**
   * Sets a regular expression to test the string against.
   * @param regex The regular expression to set.
   * @returns A new StringVerifier instance with updated regex.
   */
  public setRegex(regex: RegExp) {
    return new StringVerifier({ ...this.data, regex });
  }

  /**
   * Sets the expected string value.
   * @param expectedString The expected string value to set.
   * @returns A new StringVerifier instance with updated expectedString.
   */
  public setExpectedString(expectedString: string) {
    return new StringVerifier({ ...this.data, expectedString });
  }
}

function checkString(
  this: VerifierCheckData<ItemTypes.String>,
  input: unknown,
): VerifierFunctionOutput {
  const { lang } = this;
  const {
    errors: {
      string: { not },
    },
  } = lang;
  return isString(input) ? success() : fail(not);
}

function checkExpectedString(
  this: VerifierCheckData<ItemTypes.String>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isString(input)) return success();

  const { lang, data } = this;
  const eStr = data.expectedString;

  if (!isString(eStr)) return success();

  const {
    errors: {
      string: { notEqual },
    },
  } = lang;

  return input === eStr ? success() : error(replace(notEqual, [input, eStr]));
}

function checkLengths(
  this: VerifierCheckData<ItemTypes.String>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isString(input)) return error();

  const { lang, data } = this;
  const { maxLength, minLength, length } = data;
  const isMax = isNumber(maxLength);
  const isMin = isNumber(minLength);
  const isLen = isNumber(length);

  const {
    errors: {
      string: {
        lengths: { both, min, max, notEqual },
      },
    },
  } = lang;

  if (!isMax && !isMin && !length) return success();
  if ((isMax || isMin) && isLen) return fail(both);
  if (isLen && length !== input.length)
    return error(replace(notEqual, [input, input.length, length]));

  if (isMax) {
    if (!Number.isInteger(maxLength)) return fail(max.integer);
    if (maxLength < 0) return fail(max.negative);
    if (maxLength < (minLength ?? 0)) return fail(max.lower);
  }

  if (isMin) {
    if (!Number.isInteger(minLength)) return fail(min.integer);
    if (minLength < 0) return fail(min.negative);
  }

  if (isMax && maxLength < input.length)
    return error(replace(max.more, [input, input.length, maxLength]));
  if (isMin && minLength > input.length)
    return error(replace(min.less, [input, input.length, minLength]));

  return success();
}

function checkRegex(
  this: VerifierCheckData<ItemTypes.String>,
  input: unknown,
): VerifierFunctionOutput {
  const { data, lang } = this;

  if (!isString(input) || !data.regex) return success();

  const {
    errors: {
      string: { regex },
    },
  } = lang;

  return input.match(data.regex) ? success() : (
      error(replace(regex, [input, data.regex.toString()]))
    );
}
