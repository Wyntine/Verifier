import {
  ItemTypes,
  VerifierContext,
  VerifierCheckData,
  VerifierFunctionOutput,
} from "../types/general.js";
import { replace } from "../utils/strings.js";
import { isBoolean, error, fail, success } from "../utils/verify.js";
import { BaseVerifier } from "./BaseVerifier.js";

/**
 * Verifier for boolean values.
 */
export class BooleanVerifier extends BaseVerifier<ItemTypes.Boolean> {
  /**
   * Constructor for BooleanVerifier.
   * @param verifierContext Optional context for the verifier.
   */
  constructor(verifierContext?: VerifierContext<ItemTypes.Boolean>) {
    super([checkBoolean, checkExpectedBoolean], verifierContext);
  }

  /**
   * Sets the expected boolean value.
   * @param expectedBoolean The expected boolean value.
   * @returns A new BooleanVerifier instance with updated expectedBoolean.
   */
  public setExpectedBoolean(expectedBoolean: boolean) {
    return new BooleanVerifier({ ...this.data, expectedBoolean });
  }
}

function checkBoolean(
  this: VerifierCheckData<ItemTypes.Boolean>,
  input: unknown,
): VerifierFunctionOutput {
  const { lang } = this;
  const {
    errors: {
      boolean: { not },
    },
  } = lang;

  return isBoolean(input) ? success() : fail(not);
}

function checkExpectedBoolean(
  this: VerifierCheckData<ItemTypes.Boolean>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isBoolean(input)) return success();

  const { lang, data } = this;
  const {
    errors: {
      boolean: { notEqual },
    },
  } = lang;

  const eBool = data.expectedBoolean;

  if (!isBoolean(eBool)) return success();

  return input === eBool ? success() : error(replace(notEqual, [input, eBool]));
}
