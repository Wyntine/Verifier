import {
  ItemTypes,
  VerifierContext,
  VerifierMaps,
  VerifierConstructor,
  VerifierCheckData,
  VerifierFunctionOutput,
  VerifierMap,
  VerifierOutputType,
} from "../types/general.js";
import { AddArrayItemOptions, ArrayItem } from "../types/verifiers/array.js";
import { replace } from "../utils/strings.js";
import {
  isArray,
  isNumber,
  error,
  fail,
  success,
  createVerifier,
} from "../utils/verify.js";
import { BaseVerifier } from "./BaseVerifier.js";

/**
 * Verifier for arrays with various constraints.
 */
export class ArrayVerifier extends BaseVerifier<ItemTypes.Array> {
  /**
   * Constructor for ArrayVerifier.
   * @param verifierContext Optional context for the verifier.
   */
  constructor(verifierContext?: VerifierContext<ItemTypes.Array>) {
    super([checkArray, checkLengths, checkItems, checkExact], verifierContext);
  }

  /**
   * Sets the maximum length for the array.
   * @param maxLength Maximum length of the array.
   * @returns A new ArrayVerifier instance with updated maxLength.
   */
  public setMaxLength(maxLength: number) {
    return new ArrayVerifier({ ...this.data, maxLength });
  }

  /**
   * Sets the minimum length for the array.
   * @param minLength Minimum length of the array.
   * @returns A new ArrayVerifier instance with updated minLength.
   */
  public setMinLength(minLength: number) {
    return new ArrayVerifier({ ...this.data, minLength });
  }

  /**
   * Sets the exact length for the array.
   * @param length Exact length of the array.
   * @returns A new ArrayVerifier instance with updated length.
   */
  public setLength(length: number) {
    return new ArrayVerifier({ ...this.data, length });
  }

  /**
   * Sets whether the array should have exact items as specified.
   * @param exact Whether the array should have exact items.
   * @returns A new ArrayVerifier instance with updated exact flag.
   */
  public setExact(exact: boolean) {
    return new ArrayVerifier({ ...this.data, exact });
  }

  /**
   * Adds a string item to the array verifier.
   * @param data Optional data for the string item.
   * @returns A new ArrayVerifier instance with the string item added.
   */
  public addString(data?: AddArrayItemOptions<ItemTypes.String>) {
    return this.addItem(data, ItemTypes.String);
  }

  /**
   * Adds a boolean item to the array verifier.
   * @param data Optional data for the boolean item.
   * @returns A new ArrayVerifier instance with the boolean item added.
   */
  public addBoolean(data?: AddArrayItemOptions<ItemTypes.Boolean>) {
    return this.addItem(data, ItemTypes.Boolean);
  }

  /**
   * Adds a number item to the array verifier.
   * @param data Optional data for the number item.
   * @returns A new ArrayVerifier instance with the number item added.
   */
  public addNumber(data?: AddArrayItemOptions<ItemTypes.Number>) {
    return this.addItem(data, ItemTypes.Number);
  }

  /**
   * Adds an array item to the array verifier.
   * @param data Optional data for the array item.
   * @returns A new ArrayVerifier instance with the array item added.
   */
  public addArray(data?: AddArrayItemOptions<ItemTypes.Array>) {
    return this.addItem(data, ItemTypes.Array);
  }

  /**
   * Adds an object item to the array verifier.
   * @param data Optional data for the object item.
   * @returns A new ArrayVerifier instance with the object item added.
   */
  public addObject(data?: AddArrayItemOptions<ItemTypes.Object>) {
    return this.addItem(data, ItemTypes.Object);
  }

  /**
   * Adds an item to the array verifier.
   * @param data Optional data for the item.
   * @param itemType The type of the item.
   * @returns A new ArrayVerifier instance with the item added.
   */
  private addItem<ItemType extends ItemTypes>(
    data: AddArrayItemOptions<ItemType> | undefined = {},
    itemType: ItemType,
  ) {
    const { verifierData, ...options } = data;
    const currentItems = this.data.items ?? [];
    const verifierClass = (
      itemType === ItemTypes.Array ?
        ArrayVerifier
      : VerifierMaps[itemType]) as VerifierConstructor<ItemType>;

    const verifier = createVerifier(verifierData, verifierClass);
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
