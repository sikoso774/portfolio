import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function astroFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return astroFiles(path);
    return path.endsWith(".astro") ? [path] : [];
  });
}

describe("formatting hygiene", () => {
  it("never uses `prettier-ignore` in an .astro file", () => {
    // prettier-plugin-astro lit les positions du compilateur Astro en octets UTF-8 mais les
    // applique comme des indices de texte : chaque caractère accentué placé AVANT un nœud
    // `<!-- prettier-ignore -->` fait perdre un caractère au nœud ignoré (`<svg w` -> `idth=`).
    // Les commentaires étaient en plus publiés dans le HTML. On les interdit donc.
    const offenders = astroFiles("src").filter((file) =>
      readFileSync(file, "utf-8").includes("prettier-ignore"),
    );
    expect(offenders).toEqual([]);
  });
});
