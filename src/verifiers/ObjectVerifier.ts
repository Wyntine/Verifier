import {
  AddItemData,
  ItemTypes,
  VerifierBuilder,
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
import { error, fail, isObject, success } from "../utils/verify.js";
import { BaseVerifier } from "./BaseVerifier.js";

export class ObjectVerifier extends BaseVerifier<ItemTypes.Object> {
  constructor(verifierContext?: VerifierContext<ItemTypes.Object>) {
    super(
      [checkObject, checkNotAllowed, checkItems, checkExact],
      verifierContext,
    );
  }

  public setExact(exact: boolean) {
    return new ObjectVerifier({ ...this.data, exact });
  }

  public setGeneralType<ItemType extends ItemTypes>(
    verifierType: ItemType,
    verifierData: AddItemData<ItemType>,
  ) {
    const verifierClass = (
      verifierType === ItemTypes.Object ?
        ObjectVerifier
      : VerifierMaps[verifierType]) as VerifierConstructor<ItemType>;

    const verifier =
      verifierData instanceof verifierClass ? verifierData : (
        (verifierData as VerifierBuilder<ItemType>)(new verifierClass())
      );
    return new ObjectVerifier({ ...this.data, generalType: verifier });
  }

  public setNotAllowedKeys(keys: string[]) {
    return new ObjectVerifier({ ...this.data, notAllowedKeys: keys });
  }

  public addNotAllowedKeys(keys: string[]) {
    const finalKeys = Array.from(
      new Set([...(this.data.notAllowedKeys ?? []), ...keys]),
    );
    return this.setNotAllowedKeys(finalKeys);
  }

  public addString(key: string, data?: AddObjectItemOptions<ItemTypes.String>) {
    return this.addItem(data, ItemTypes.String, key);
  }

  public addBoolean(
    key: string,
    data?: AddObjectItemOptions<ItemTypes.Boolean>,
  ) {
    return this.addItem(data, ItemTypes.Boolean, key);
  }

  public addNumber(key: string, data?: AddObjectItemOptions<ItemTypes.Number>) {
    return this.addItem(data, ItemTypes.Number, key);
  }

  public addArray(key: string, data?: AddObjectItemOptions<ItemTypes.Array>) {
    return this.addItem(data, ItemTypes.Array, key);
  }

  public addObject(key: string, data?: AddObjectItemOptions<ItemTypes.Object>) {
    return this.addItem(data, ItemTypes.Object, key);
  }

  private addItem<ItemType extends ItemTypes>(
    {
      verifierData,
      ...options
    }: AddObjectItemOptions<ItemType> | undefined = {},
    itemType: ItemType,
    key: string,
  ) {
    const currentItems = this.data.items ?? [];
    const verifierClass = (
      itemType === ItemTypes.Object ?
        ObjectVerifier
      : VerifierMaps[itemType]) as VerifierConstructor<ItemType>;

    const verifier =
      verifierData ?
        verifierData instanceof verifierClass ?
          verifierData
        : (verifierData as VerifierBuilder<ItemType>)(new verifierClass())
      : new verifierClass();
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

    if (!(key in input) && required) {
      errors.push([key, [replace(notExists, [key])]]);
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
