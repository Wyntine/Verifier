import { AddItemData, ItemTypes, VerifierMap } from "../general.js";

export interface ObjectVerifierData {
  exact?: boolean;
  generalType?: VerifierMap[ItemTypes];
  items?: ObjectItem[];
  notAllowedKeys?: string[];
}

export interface ObjectItem {
  verifier: VerifierMap[ItemTypes];
  itemType: ItemTypes;
  key: string;
  options?: ObjectItemOptions;
}

export interface ObjectItemOptions {
  required?: boolean;
}

export interface AddObjectItemOptions<ItemType extends ItemTypes>
  extends ObjectItemOptions {
  verifierData?: AddItemData<ItemType>;
}
