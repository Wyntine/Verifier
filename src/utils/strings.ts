export function replace(
  string: string,
  replaced: (string | number | boolean)[]
): string {
  return replaced.reduce<string>(
    (total, current, index) =>
      total.replace(
        new RegExp(`\\{${index.toString()}\\}`, "g"),
        current.toString()
      ),
    string
  );
}
