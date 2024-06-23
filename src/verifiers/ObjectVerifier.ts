import {
  AddItemData,
  ItemTypes,
  VerifierCheckData,
  VerifierConstructor,
  VerifierContext,
  VerifierFunctionOutput,
  VerifierMap,
  VerifierMaps,
  VerifierOutputType,
} from "../types/general.js";
import { AddObjectItemOptions, ObjectItem } from "../types/verifiers/object.js";
import { replace } from "../utils/strings.js";
import {
  createVerifier,
  error,
  fail,
  isObject,
  success,
} from "../utils/verify.js";
import { ArrayVerifier } from "./ArrayVerifier.js";
import { BaseVerifier } from "./BaseVerifier.js";

/**
 * Verifier for object values.
 */
export class ObjectVerifier extends BaseVerifier<ItemTypes.Object> {
  /**
   * Constructor for ObjectVerifier.
   * @param verifierContext Optional context for the verifier.
   */
  constructor(verifierContext?: VerifierContext<ItemTypes.Object>) {
    super(
      [checkObject, checkNotAllowed, checkItems, checkExact],
      verifierContext,
    );
  }

  /**
   * Sets whether the object should exactly match the specified structure.
   * @param exact True if the object should match exactly.
   * @returns A new ObjectVerifier instance with updated exact.
   */
  public setExact(exact: boolean) {
    return new ObjectVerifier({ ...this.data, exact });
  }

  /**
   * Sets a general type verifier for the object.
   * @param verifierType The type of the verifier.
   * @param verifierData The data for the verifier.
   * @returns A new ObjectVerifier instance with updated generalType.
   */
  public setGeneralType<ItemType extends ItemTypes>(
    verifierType: ItemType,
    verifierData: AddItemData<ItemType>,
  ) {
    const verifierClass = (
      verifierType === ItemTypes.Array ?
        ArrayVerifier
      : VerifierMaps[verifierType]) as VerifierConstructor<ItemType>;

    const verifier = createVerifier(verifierData, verifierClass);
    return new ObjectVerifier({ ...this.data, generalType: verifier });
  }

  /**
   * Sets the keys that are not allowed in the object.
   * @param keys An array of keys.
   * @returns A new ObjectVerifier instance with updated notAllowedKeys.
   */
  public setNotAllowedKeys(keys: string[]) {
    return new ObjectVerifier({ ...this.data, notAllowedKeys: keys });
  }

  /**
   * Adds keys to the not allowed keys list.
   * @param keys An array of keys.
   * @returns A new ObjectVerifier instance with updated notAllowedKeys.
   */
  public addNotAllowedKeys(keys: string[]) {
    const finalKeys = Array.from(
      new Set([...(this.data.notAllowedKeys ?? []), ...keys]),
    );
    return this.setNotAllowedKeys(finalKeys);
  }

  /**
   * Adds a string item to the object.
   * @param key The key of the item.
   * @param data Optional data for the item.
   * @returns A new ObjectVerifier instance with the added string item.
   */
  public addString(key: string, data?: AddObjectItemOptions<ItemTypes.String>) {
    return this.addItem(data, ItemTypes.String, key);
  }

  /**
   * Adds a boolean item to the object.
   * @param key The key of the item.
   * @param data Optional data for the item.
   * @returns A new ObjectVerifier instance with the added boolean item.
   */
  public addBoolean(
    key: string,
    data?: AddObjectItemOptions<ItemTypes.Boolean>,
  ) {
    return this.addItem(data, ItemTypes.Boolean, key);
  }

  /**
   * Adds a number item to the object.
   * @param key The key of the item.
   * @param data Optional data for the item.
   * @returns A new ObjectVerifier instance with the added number item.
   */
  public addNumber(key: string, data?: AddObjectItemOptions<ItemTypes.Number>) {
    return this.addItem(data, ItemTypes.Number, key);
  }

  /**
   * Adds an array item to the object.
   * @param key The key of the item.
   * @param data Optional data for the item.
   * @returns A new ObjectVerifier instance with the added array item.
   */
  public addArray(key: string, data?: AddObjectItemOptions<ItemTypes.Array>) {
    return this.addItem(data, ItemTypes.Array, key);
  }

  /**
   * Adds an object item to the object.
   * @param key The key of the item.
   * @param data Optional data for the item.
   * @returns A new ObjectVerifier instance with the added object item.
   */
  public addObject(key: string, data?: AddObjectItemOptions<ItemTypes.Object>) {
    return this.addItem(data, ItemTypes.Object, key);
  }

  /**
   * Adds an item to the object verifier.
   * @param data Optional data for the item.
   * @param itemType The type of the item.
   * @param key The key of the item.
   * @returns A new ObjectVerifier instance with the added item.
   */
  private addItem<ItemType extends ItemTypes>(
    data: AddObjectItemOptions<ItemType> | undefined = {},
    itemType: ItemType,
    key: string,
  ) {
    const { verifierData, ...options } = data;
    const currentItems = this.data.items ?? [];
    const verifierClass = (
      itemType === ItemTypes.Array ?
        ArrayVerifier
      : VerifierMaps[itemType]) as VerifierConstructor<ItemType>;
    const verifier = createVerifier(verifierData, verifierClass);
    const item: ObjectItem = { verifier, itemType, options, key };
    return new ObjectVerifier({ ...this.data, items: [...currentItems, item] });
  }
}

function checkObject(
  this: VerifierCheckData<ItemTypes.Object>,
  input: unknown,
): VerifierFunctionOutput {
  const { lang } = this;
  const { not } = lang.errors.object;

  return isObject(input) ? success() : fail(not);
}

function checkNotAllowed(
  this: VerifierCheckData<ItemTypes.Object>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isObject(input)) return success();

  const { lang, data } = this;
  const { notAllowedKeys = [], items = [] } = data;
  const { notAllowed, usingNotAllowed } = lang.errors.object;

  if (!notAllowedKeys.length) return success();

  const targetKeys = Object.keys(input);
  const rejectedKeys = targetKeys.filter((key) => notAllowedKeys.includes(key));
  const usingRejected = notAllowedKeys.filter((key) =>
    items.find((item) => item.key === key),
  );

  if (rejectedKeys.length)
    return error(replace(notAllowed, [rejectedKeys.join(", ")]));

  if (usingRejected.length)
    return fail(replace(usingNotAllowed, [usingRejected.join(", ")]));

  return success();
}

function checkItems(
  this: VerifierCheckData<ItemTypes.Object>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isObject(input)) return success();

  const { lang, data } = this;
  const { items = [], notAllowedKeys = [], generalType, exact } = data;
  const {
    items: { notExists, keyOf },
  } = lang.errors.object;

  const targetKeys = Object.keys(input).filter(
    (item) => !notAllowedKeys.includes(item),
  );
  const extra = targetKeys.filter(
    (key) => !items.find((item) => item.key !== key),
  );

  const errors: [string, string[]][] = [];

  const verifyItem = (key: string, verifier: VerifierMap[ItemTypes]) => {
    const result = verifier.verify(input[key as keyof typeof input]);

    if (result.status !== VerifierOutputType.Success) {
      errors.push([key, result.errors]);
    }
  };

  for (const item of items) {
    const { verifier, options, key } = item;
    const { required = false } = options ?? {};

    if (!(key in input)) {
      if (required) {
        errors.push([key, [replace(notExists, [key])]]);
      }
      continue;
    }

    verifyItem(key, verifier);
  }

  if (!exact && generalType) {
    for (const key of extra) {
      verifyItem(key, generalType);
    }
  }

  if (!errors.length) return success();

  return error(
    ...errors
      .map(([key, errorList]) => [
        replace(`-- ${keyOf} --`, [key]),
        ...errorList,
      ])
      .flat(),
  );
}

function checkExact(
  this: VerifierCheckData<ItemTypes.Object>,
  input: unknown,
): VerifierFunctionOutput {
  if (!isObject(input)) return success();

  const { lang, data } = this;
  const { items = [], exact, notAllowedKeys = [] } = data;
  const { extraKeys } = lang.errors.object;

  if (!exact) return success();

  const targetKeys = Object.keys(input).filter(
    (item) => !notAllowedKeys.includes(item),
  );
  const extra = targetKeys.filter(
    (key) => !items.find((item) => item.key !== key),
  );

  if (extra.length) return error(replace(extraKeys, [extra.join(", ")]));

  return success();
}
