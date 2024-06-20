import {
  ItemTypes,
  VerifierContext,
  VerifierMaps,
  VerifierConstructor,
  VerifierBuilder,
  VerifierCheckData,
  VerifierFunctionOutput,
  VerifierMap,
  VerifierOutputType,
} from "../types/general.js";
import { AddArrayItemOptions, ArrayItem } from "../types/verifiers/array.js";
import { replace } from "../utils/strings.js";
import { isArray, isNumber, error, fail, success } from "../utils/verify.js";
import { BaseVerifier } from "./BaseVerifier.js";

export class ArrayVerifier extends BaseVerifier<ItemTypes.Array> {
  constructor(verifierContext?: VerifierContext<ItemTypes.Array>) {
    super([checkArray, checkLengths, checkItems, checkExact], verifierContext);
  }

  public setMaxLength(maxLength: number) {
    return new ArrayVerifier({ ...this.data, maxLength });
  }

  public setMinLength(minLength: number) {
    return new ArrayVerifier({ ...this.data, minLength });
  }

  public setLength(length: number) {
    return new ArrayVerifier({ ...this.data, length });
  }

  public setExact(exact: boolean) {
    return new ArrayVerifier({ ...this.data, exact });
  }

  public addString(data?: AddArrayItemOptions<ItemTypes.String>) {
    return this.addItem(data, ItemTypes.String);
  }

  public addBoolean(data?: AddArrayItemOptions<ItemTypes.Boolean>) {
    return this.addItem(data, ItemTypes.Boolean);
  }

  public addNumber(data?: AddArrayItemOptions<ItemTypes.Number>) {
    return this.addItem(data, ItemTypes.Number);
  }

  public addArray(data?: AddArrayItemOptions<ItemTypes.Array>) {
    return this.addItem(data, ItemTypes.Array);
  }

  public addObject(data?: AddArrayItemOptions<ItemTypes.Object>) {
    return this.addItem(data, ItemTypes.Object);
  }

  private addItem<ItemType extends ItemTypes>(
    {
      verifierData,
      ...options
    }: AddArrayItemOptions<ItemType> | undefined = {},
    itemType: ItemType,
  ) {
    const currentItems = this.data.items ?? [];
    const verifierClass = (
      itemType === ItemTypes.Array ?
        ArrayVerifier
      : VerifierMaps[itemType]) as VerifierConstructor<ItemType>;

    const verifier =
      verifierData ?
        verifierData instanceof verifierClass ?
          verifierData
        : (verifierData as VerifierBuilder<ItemType>)(new verifierClass())
      : new verifierClass();
    const item: ArrayItem = { verifier, itemType, options };
    return new ArrayVerifier({ ...this.data, items: [...currentItems, item] });
  }
}

function checkArray(
  this: VerifierCheckData<ItemTypes.Array>,
  input: unknown,
): VerifierFunctionOutput {
  const { lang } = this;
  const { not } = lang.errors.array;

  return isArray(input) ? success() : fail(not);
}

function checkLengths(
  this: VerifierCheckData<ItemTypes.Array>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isArray(input)) return success();

  const { data, lang } = this;
  const { maxLength, minLength, length } = data;
  const isMax = isNumber(maxLength);
  const isMin = isNumber(minLength);
  const isLen = isNumber(length);

  const { both, min, max, notEqual } = lang.errors.array.lengths;

  if (!isMax && !isMin && !length) return success();
  if ((isMax || isMin) && isLen) return fail(both);
  if (isLen && length !== input.length)
    return error(replace(notEqual, [input.length, length]));

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
    return error(replace(max.more, [input.length, maxLength]));
  if (isMin && minLength > input.length)
    return error(replace(min.less, [input.length, minLength]));

  return success();
}

function checkItems(
  this: VerifierCheckData<ItemTypes.Array>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isArray(input)) return success();
  const { data, lang } = this;
  const { items = [] } = data;

  if (!items.length) return success();

  const { indexOf, repeatCountNotInteger, repeatedItem } =
    lang.errors.array.items;

  let arrayIndex = 0;
  const errors: [number, string[]][] = [];

  const verifyItem = (verifier: VerifierMap[ItemTypes]) => {
    const arrayItem = input[arrayIndex];
    const result = verifier.verify(arrayItem);

    if (result.status !== VerifierOutputType.Success) {
      errors.push([arrayIndex, result.errors]);
    }

    arrayIndex++;
  };

  for (const item of items) {
    const { verifier, options } = item;
    const { repeatCount, repeated } = options ?? {};

    if (repeated && items.indexOf(item) !== items.length - 1)
      return fail(repeatedItem);

    if (repeatCount !== undefined) {
      if (repeatCount <= 0 || !Number.isInteger(repeatCount))
        return fail(replace(repeatCountNotInteger, [repeatCount]));

      for (let rc = 0; rc < repeatCount + 1; rc++) {
        verifyItem(verifier);
      }

      continue;
    }

    if (repeated) {
      const repeatCount = input.length - arrayIndex;
      for (let rc = 0; rc < repeatCount; rc++) {
        verifyItem(verifier);
      }

      continue;
    }

    verifyItem(verifier);
  }

  if (!errors.length) return success();

  return error(
    ...errors
      .map(([index, errorList]) => [
        replace(`-- ${indexOf} --`, [index]),
        ...errorList,
      ])
      .flat(),
  );
}

function checkExact(
  this: VerifierCheckData<ItemTypes.Array>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isArray(input)) return success();

  const { data, lang } = this;
  const { items = [], exact } = data;

  if (!exact) return success();

  const repeated = !!items.at(-1)?.options?.repeated;

  if (repeated) return success();

  const itemCount = items.reduce(
    (total, item) => total + 1 + (item.options?.repeatCount ?? 0),
    0,
  );

  if (input.length === itemCount) return success();

  const { notEqual } = lang.errors.array;

  return error(notEqual);
}
