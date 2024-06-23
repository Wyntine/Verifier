import {
  ItemTypes,
  VerifierFunction,
  VerifierData,
  VerifierContext,
  VerifierOutputData,
  ItemTypeMap,
} from "../types/general.js";
import { getLang } from "../utils/language.js";
import { verify, verifyFailOnError } from "../utils/verify.js";

/**
 * Base verifier class for different item types.
 */
export class BaseVerifier<ItemType extends ItemTypes> {
  private verifiers: VerifierFunction<ItemType>[] = [];
  public data: VerifierData[ItemType] = {};

  /**
   * Constructor for BaseVerifier.
   * @param verifierFunctions Array of verifier functions.
   * @param verifierContext Optional context for the verifier.
   */
  constructor(
    verifierFunctions: VerifierFunction<ItemType>[],
    verifierContext?: VerifierContext<ItemType>,
  ) {
    this.verifiers = verifierFunctions;
    if (verifierContext) {
      this.data = (
        verifierContext instanceof BaseVerifier ?
          verifierContext.data
        : verifierContext) as VerifierData[ItemType];
    }
  }

  /**
   * Verifies the input using the configured verifiers.
   * @param input The input to verify.
   * @returns The verification result.
   */
  public verify(input: unknown): VerifierOutputData {
    const lang = getLang();
    const verifiers = this.verifiers.map((verif) =>
      verif.bind({ data: this.data, lang }),
    );
    return verify(input, verifiers);
  }

  /**
   * Verifies the input and asserts its type, throwing an error if verification fails.
   * @param input The input to verify.
   */
  public verifyFailOnError(
    input: unknown,
  ): asserts input is ItemTypeMap[ItemType] {
    const lang = getLang();
    const verifiers = this.verifiers.map((verif) =>
      verif.bind({ data: this.data, lang }),
    );
    verifyFailOnError<ItemTypeMap[ItemType]>(input, verifiers);
  }
}
