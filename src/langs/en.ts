import { LangInterface } from "../types/languages";

const lang: LangInterface = {
  errors: {
    string: {
      not: "Given input is not a string.",
      notEqual: "Given string '{0}' is not equal to '{1}'.",
      lengths: {
        both: "Maximum and minimum lengths cannot used together with fixed length option.",
        notEqual: "Given string '{0}' ({1}) has not equal length of {2}.",
        max: {
          lower: "Maximum option cannot be lower than minimum.",
          negative: "Maximum option cannot be negative.",
          integer: "Maximum option should be an integer.",
          more: "Given string '{0}' ({1}) is longer than given maximum length of {2}.",
        },
        min: {
          negative: "Minimum option cannot be negative.",
          integer: "Minimum option should be an integer.",
          less: "Given string '{0}' ({1}) is shorter than given minimum length of {2}.",
        },
      },
      regex: "Given string '{0}' does not match given RegExp '{1}'.",
    },
    boolean: {
      not: "Given input is not a boolean.",
      notEqual: "Given boolean '{0}' is not equal to '{1}'.",
    },
    array: {
      not: "Given input is not an array.",
      notEqual: "Given array is not exact to matched array.",
      lengths: {
        both: "Maximum and minimum lengths cannot used together with fixed length option.",
        notEqual: "Given array ({0}) has not equal length of {1}.",
        max: {
          lower: "Maximum option cannot be lower than minimum.",
          negative: "Maximum option cannot be negative.",
          integer: "Maximum option should be an integer.",
          more: "Given array ({0}) is longer than given maximum length of {1}.",
        },
        min: {
          negative: "Minimum option cannot be negative.",
          integer: "Minimum option should be an integer.",
          less: "Given array ({0}) is shorter than given minimum length of {1}.",
        },
      },
      items: {
        indexOf: "Array index '{0}'",
        repeatedItem: "Repeated item should be the last item.",
        repeatCountNotInteger:
          "Repeat count '{0}' should be a positive integer.",
      },
    },
    object: {
      not: "Given input is not an object.",
      notAllowed: "Given object has keys that are not allowed: {0}",
      extraKeys: "Given object has extra keys: {0}",
      usingNotAllowed: "Cannot use not allowed keys in items: {0}",
      items: {
        notExists: "Given object do not have required key '{0}'.",
        keyOf: "Object key '{0}'",
      },
    },
    number: {
      not: "Given input is not a number.",
      notEqual: "Given number '{0}' is not equal to '{1}'.",
      signs: {
        positive: "Given number '{0}' is not allowed to be positive.",
        negative: "Given number '{0}' is not allowed to be negative.",
        zero: "Given number '{0}' is not allowed to be zero.",
      },
      values: {
        max: "Given number '{0}' should not be greater than '{1}'.",
        min: "Given number '{0}' should not be lower than '{1}'.",
        maxLower: "Maximum option cannot be lower than minimum.",
      },
      integers: {
        notSafe:
          "Given number '{0}' is not a safe integer. (-9007199254740991 ≤ x ≤ 9007199254740991)",
        notInteger: "Given number '{0}' is not a integer.",
      },
      ranges: {
        excluded:
          "Given number '{0}' is in a excluded range of '{1}{2},{3}{4}'",
        notInAllowed: "Given number '{0}' is not in any of the allowed ranges.",
        endLower: "End option cannot be equal or lower than start option.",
      },
      dividable: {
        zero: "Cannot check divisions by 0.",
        cannot: "Given number '{0}' cannot be divided by: {1}",
      },
    },
  },
};

export default lang;
