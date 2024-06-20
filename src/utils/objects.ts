export function keyNames(object: unknown): string[] {
  const keys: string[] = [];

  if (!object || typeof object !== "object") return keys;

  const keyArray = Object.keys(object);

  for (const item of keyArray) {
    const value: unknown = object[item as keyof typeof object];
    keys.push(
      ...(value && typeof value === "object" ? keyNames(value) : [item])
    );
  }

  return keys;
}

export function accessKey<Data>(object: unknown, keyPath: string): Data {
  if (!object || typeof object !== "object")
    throw new Error("Given input is not a object.");

  const keys = keyPath.split(".");
  return keys.reduce((value, current) => {
    return typeof value === "object" && current in value
      ? value[current as keyof typeof value]
      : (() => {
          throw new Error(`Given object does not have the path: ${keyPath}`);
        })();
  }, object) as Data;
}
