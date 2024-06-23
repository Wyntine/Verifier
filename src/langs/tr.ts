import { LangInterface } from "../types/languages.js";

const lang: LangInterface = {
  errors: {
    string: {
      not: "Verilen girdi bir metin değil.",
      notEqual: "Verilen metin '{0}' '{1}' ile eşit değil.",
      lengths: {
        both: "Maksimum ve minimum uzunluklar sabit uzunluk seçeneğiyle birlikte kullanılamaz.",
        notEqual: "Verilen metnin '{0}' uzunluğu ({1}) {2}'ye eşit değil.",
        max: {
          lower: "Maksimum seçeneği minimumdan düşük olamaz.",
          negative: "Maksimum seçeneği negatif olamaz.",
          integer: "Maksimum seçeneği bir tam sayı olmalıdır.",
          more: "Verilen metnin '{0}' uzunluğu ({1}) maksimum uzunluktan ({2}) fazla.",
        },
        min: {
          negative: "Minimum seçeneği negatif olamaz.",
          integer: "Minimum seçeneği bir tam sayı olmalıdır.",
          less: "Verilen metnin '{0}' uzunluğu ({1}) minimum uzunluktan ({2}) az.",
        },
      },
      regex: "Verilen metin '{0}' belirtilen RegExp '{1}' ile eşleşmiyor.",
    },
    boolean: {
      not: "Verilen girdi bir boolean değil.",
      notEqual: "Verilen boolean '{0}' '{1}' ile eşit değil.",
    },
    array: {
      not: "Verilen girdi bir dizi değil.",
      notEqual: "Verilen dizi eşleşen diziye tam olarak eşit değil.",
      lengths: {
        both: "Maksimum ve minimum uzunluklar sabit uzunluk seçeneğiyle birlikte kullanılamaz.",
        notEqual: "Verilen dizi ({0}), {1} uzunluğuna eşit değil.",
        max: {
          lower: "Maksimum seçeneği minimumdan düşük olamaz.",
          negative: "Maksimum seçeneği negatif olamaz.",
          integer: "Maksimum seçeneği bir tam sayı olmalıdır.",
          more: "Verilen dizi ({0}), belirtilen maksimum uzunluktan {1} fazla.",
        },
        min: {
          negative: "Minimum seçeneği negatif olamaz.",
          integer: "Minimum seçeneği bir tam sayı olmalıdır.",
          less: "Verilen dizi ({0}), belirtilen minimum uzunluktan {1} az.",
        },
      },
      items: {
        indexOf: "Dizi sırası '{0}'",
        repeatedItem: "Tekrarlanan öge son öge olmalı.",
        repeatCountNotInteger:
          "Tekrar sayısı '{0}' pozitif bir tam sayı olmalıdır.",
      },
    },
    object: {
      not: "Verilen girdi bir nesne değil.",
      notAllowed: "Verilen nesnede izin verilmeyen anahtarlar bulunuyor: {0}",
      extraKeys: "Verilen nesnede ekstra anahtarlar bulunuyor: {0}",
      usingNotAllowed: "Ögelerde izin verilmeyen anahtarlar kullanılamaz: {0}",
      items: {
        notExists: "Verilen nesnede gerekli anahtar '{0}' bulunmuyor.",
        keyOf: "Nesne anahtarı '{0}'",
      },
    },
    number: {
      not: "Verilen girdi bir sayı değil.",
      notEqual: "Verilen sayı '{0}' '{1}' ile eşit değil.",
      signs: {
        positive: "Verilen sayı pozitif olmamalıdır: '{0}'.",
        negative: "Verilen sayı negatif olmamalıdır: '{0}'.",
        zero: "Verilen sayı sıfır olmamalıdır: '{0}'.",
      },
      values: {
        max: "Verilen sayı '{0}' '{1}' değerinden büyük olmamalıdır.",
        min: "Verilen sayı '{0}' '{1}' değerinden küçük olmamalıdır.",
        maxLower: "Maksimum seçeneği minimumdan düşük olamaz.",
      },
      integers: {
        notSafe:
          "Verilen sayı güvenli bir tam sayı değil. (-9007199254740991 ≤ x ≤ 9007199254740991)",
        notInteger: "Verilen sayı bir tam sayı değil: '{0}'.",
      },
      ranges: {
        excluded: "Verilen sayı '{0}' '{1}{2},{3}{4}' aralığında bulunuyor.",
        notInAllowed:
          "Verilen sayı izin verilen herhangi bir aralıkta bulunmuyor.",
        endLower:
          "Bitiş seçeneği başlangıç seçeneğinden eşit veya düşük olamaz.",
      },
      dividable: {
        zero: "0'a bölünmeler kontrol edilemez.",
        cannot: "Verilen sayı '{0}' şu sayılarla bölünemez: {1}",
      },
    },
  },
};

export default lang;
