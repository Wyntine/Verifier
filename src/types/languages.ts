import { langMap } from "../utils/language.js";

export type Langs = keyof typeof langMap;

export interface LangInterface {
  errors: {
    string: {
      not: string;
      notEqual: string;
      lengths: {
        both: string;
        notEqual: string;
        max: {
          lower: string;
          negative: string;
          integer: string;
          more: string;
        };
        min: {
          negative: string;
          integer: string;
          less: string;
        };
      };
      regex: string;
    };
    boolean: {
      not: string;
      notEqual: string;
    };
    array: {
      not: string;
      notEqual: string;
      lengths: {
        both: string;
        notEqual: string;
        max: {
          lower: string;
          negative: string;
          integer: string;
          more: string;
        };
        min: {
          negative: string;
          integer: string;
          less: string;
        };
      };
      items: {
        indexOf: string;
        repeatedItem: string;
        repeatCountNotInteger: string;
      };
    };
    object: {
      not: string;
      notAllowed: string;
      extraKeys: string;
      usingNotAllowed: string;
      items: {
        notExists: string;
        keyOf: string;
      };
    };
    number: {
      not: string;
      notEqual: string;
      signs: {
        positive: string;
        negative: string;
        zero: string;
      };
      values: {
        max: string;
        min: string;
        maxLower: string;
      };
      integers: {
        notSafe: string;
        notInteger: string;
      };
      ranges: {
        excluded: string;
        notInAllowed: string;
        endLower: string;
      };
      dividable: {
        zero: string;
        cannot: string;
      };
    };
  };
}
