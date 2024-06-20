// @ts-check

const { existsSync } = require("fs");
const { readdir, mkdir, rm, rename } = require("fs/promises");
const { x } = require("tar");

(async () => {
  const files = await readdir("./", {
    encoding: "utf-8",
    withFileTypes: true,
    recursive: false,
  });

  const packedFile = files.find(
    (file) => file.isFile() && file.name.startsWith("wyntine-verifier-"),
  );

  if (!packedFile) {
    console.error("Packed module file could not be found.");
    process.exit(0);
  }

  const folderPath = "../Test/node_modules/@wyntine";

  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true });
  } else {
    await rm(folderPath, { recursive: true });
    await mkdir(folderPath);
  }

  await x({
    file: `./${packedFile.name}`,
    cwd: `${folderPath}`,
  });

  await rename(folderPath.concat("/package"), folderPath.concat("/verifier"));
  console.log("Succesfully resetted test folder.");
})();
