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

export class BaseVerifier<ItemType extends ItemTypes> {
  private verifiers: VerifierFunction<ItemType>[] = [];
  public data: VerifierData[ItemType] = {};
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

  public verify(input: unknown): VerifierOutputData {
    const lang = getLang();
    const verifiers = this.verifiers.map((verif) =>
      verif.bind({ data: this.data, lang }),
    );
    return verify(input, verifiers);
  }

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
