import { ArrayVerifier } from "../verifiers/ArrayVerifier.js";
import { BooleanVerifier } from "../verifiers/BooleanVerifier.js";
import { NumberVerifier } from "../verifiers/NumberVerifier.js";
import { ObjectVerifier } from "../verifiers/ObjectVerifier.js";
import { StringVerifier } from "../verifiers/StringVerifier.js";
import { LangInterface } from "./languages.js";
import { ArrayVerifierData } from "./verifiers/array.js";
import { BooleanVerifierData } from "./verifiers/boolean.js";
import { NumberVerifierData } from "./verifiers/number.js";
import { ObjectVerifierData } from "./verifiers/object.js";
import { StringVerifierData } from "./verifiers/string.js";

export enum ItemTypes {
  String = "string",
  Boolean = "boolean",
  Number = "number",
  Array = "array",
  Object = "object",
}

export type AddItemData<ItemType extends ItemTypes> =
  | VerifierBuilder<ItemType>
  | VerifierMap[ItemType];

export interface VerifierData {
  [ItemTypes.String]: StringVerifierData;
  [ItemTypes.Boolean]: BooleanVerifierData;
  [ItemTypes.Number]: NumberVerifierData;
  [ItemTypes.Array]: ArrayVerifierData;
  [ItemTypes.Object]: ObjectVerifierData;
}

export interface VerifierMap {
  [ItemTypes.String]: StringVerifier;
  [ItemTypes.Boolean]: BooleanVerifier;
  [ItemTypes.Number]: NumberVerifier;
  [ItemTypes.Array]: ArrayVerifier;
  [ItemTypes.Object]: ObjectVerifier;
}

export const VerifierMaps = {
  [ItemTypes.String]: StringVerifier,
  [ItemTypes.Boolean]: BooleanVerifier,
  [ItemTypes.Number]: NumberVerifier,
  [ItemTypes.Array]: ArrayVerifier,
  [ItemTypes.Object]: ObjectVerifier,
} as const;

export interface ItemTypeMap {
  [ItemTypes.String]: string;
  [ItemTypes.Boolean]: boolean;
  [ItemTypes.Number]: number;
  [ItemTypes.Array]: unknown[];
  [ItemTypes.Object]: Exclude<object, null>;
}

export type VerifierContext<ItemType extends ItemTypes> =
  | VerifierData[ItemType]
  | VerifierMap[ItemType];

export type VerifierConstructor<ItemType extends ItemTypes> = new (
  verifierContext?: VerifierContext<ItemType>,
) => VerifierMap[ItemType];

export type VerifierBuilder<ItemType extends ItemTypes> = (
  input: VerifierMap[ItemType],
) => VerifierMap[ItemType];

export interface VerifierCheckData<ItemType extends ItemTypes> {
  data: VerifierData[ItemType];
  lang: LangInterface;
}

export enum VerifierOutputType {
  Error = "error",
  Fail = "fail",
  Success = "success",
}

export interface VerifierOutputError {
  status: VerifierOutputType.Error;
  errors: string[];
}

export interface VerifierOutputFail {
  status: VerifierOutputType.Fail;
  errors: string[];
}

export interface VerifierOutputSuccess {
  status: VerifierOutputType.Success;
}

export type VerifierOutputData = VerifierOutputError | VerifierOutputSuccess;

export type VerifierFunctionOutput = VerifierOutputData | VerifierOutputFail;

export type VerifierFunction<ItemType extends ItemTypes> = (
  this: VerifierCheckData<ItemType>,
  input: unknown,
) => VerifierFunctionOutput;

export type PureVerifierFunction = (input: unknown) => VerifierFunctionOutput;
