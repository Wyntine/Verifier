import {
  PureVerifierFunction,
  VerifierOutputData,
  VerifierOutputType,
  VerifierOutputFail,
  VerifierOutputError,
  VerifierOutputSuccess,
  ItemTypes,
  AddItemData,
  VerifierConstructor,
  VerifierMap,
} from "../types/general.js";

export function verify(
  input: unknown,
  verifiers: PureVerifierFunction[],
): VerifierOutputData {
  const errors: string[] = [];

  for (const verifier of verifiers) {
    const result = verifier(input);

    if (result.status === VerifierOutputType.Success) continue;

    if (result.status === VerifierOutputType.Fail) {
      errors.push(...result.errors);
      break;
    }

    errors.push(...result.errors);
  }

  return errors.length ?
      { status: VerifierOutputType.Error, errors }
    : { status: VerifierOutputType.Success };
}

export function verifyFailOnError<Input>(
  input: unknown,
  verifiers: PureVerifierFunction[],
): asserts input is Input {
  for (const verifier of verifiers) {
    const result = verifier(input);

    if (result.status === VerifierOutputType.Success) continue;

    throw new Error(result.errors.join("\n"));
  }
}

export function isString(input: unknown): input is string {
  return typeof input === "string";
}

export function isNumber(input: unknown): input is number {
  return typeof input === "number";
}

export function isBoolean(input: unknown): input is boolean {
  return typeof input === "boolean";
}

export function isArray(input: unknown): input is unknown[] {
  return Array.isArray(input);
}

export function isObject(input: unknown): input is Exclude<object, null> {
  return input !== null && typeof input === "object" && !isArray(input);
}

export function fail(...errors: string[]): VerifierOutputFail {
  return { status: VerifierOutputType.Fail, errors };
}

export function error(...errors: string[]): VerifierOutputError {
  return { status: VerifierOutputType.Error, errors };
}

export function success(): VerifierOutputSuccess {
  return { status: VerifierOutputType.Success };
}

export function createVerifier<ItemType extends ItemTypes>(
  verifierData: AddItemData<ItemType> | undefined,
  verifierClass: VerifierConstructor<ItemType>,
): VerifierMap[ItemType] {
  if (!verifierData) return new verifierClass();

  if (typeof verifierData !== "function") {
    if (!(verifierData instanceof verifierClass))
      throw new Error("Wrong verifier class.");
    return verifierData;
  }

  return verifierData(new verifierClass());
}
