import { VerifierMap, ItemTypes, AddItemData } from "../general.js";

export interface ArrayVerifierData {
  maxLength?: number;
  minLength?: number;
  length?: number;
  exact?: boolean;
  items?: ArrayItem[];
}

export interface ArrayItem {
  verifier: VerifierMap[ItemTypes];
  itemType: ItemTypes;
  options?: ArrayItemOptions;
}

export interface ArrayItemOptions {
  repeatCount?: number;
  repeated?: boolean;
}

export interface AddArrayItemOptions<ItemType extends ItemTypes>
  extends ArrayItemOptions {
  verifierData?: AddItemData<ItemType>;
}
