import { LangInterface, Langs } from "../types/languages.js";
import { accessKey, keyNames } from "./objects.js";

import en from "../langs/en.js";
import tr from "../langs/tr.js";

export const langMap = { en, tr };
let lang: Langs = "en";

langCheck();

export function getLangString(stringKey: string): string {
  const langData = getLang(lang);
  return accessKey<string>(langData, stringKey);
}

export function setLang(newLang: Langs) {
  lang = newLang;
}

export function getLang(selectedLang = lang): LangInterface {
  if (!(selectedLang in langMap))
    throw new Error(`Selected lang "${selectedLang}" is not available.`);

  return langMap[selectedLang];
}

function langCheck() {
  const langs = Object.entries(langMap);
  const keyMap: [string, string[]][] = [];

  for (const [name, data] of langs) {
    keyMap.push([name, keyNames(data)]);
  }

  const maxLength = Math.max(...keyMap.map(([, array]) => array.length));
  const lowerLengths = keyMap
    .filter(([, array]) => array.length < maxLength)
    .map(([name]) => name);

  if (lowerLengths.length)
    throw new Error(
      `Given languages has less data: ${lowerLengths.join(", ")}`,
    );

  const sameLength = keyMap.filter(([, array]) => array.length === maxLength);
  const missing = sameLength
    .filter(([name, array]) =>
      sameLength.find(
        ([dName, dArray]) =>
          dName !== name &&
          (array.find((item) => !dArray.includes(item)) ??
            dArray.find((item) => !array.includes(item))),
      ),
    )
    .map(([name]) => name);

  if (missing.length)
    throw new Error(
      `Given languages has different data between them: ${missing.join(", ")}`,
    );
}
