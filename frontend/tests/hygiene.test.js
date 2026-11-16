import { execFileSync } from "node:child_process";
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

  it("keeps LF line endings in every tracked text file", () => {
    // Prettier écrit du LF (`endOfLine: "lf"`). Du CRLF sur disque (VS Code ou
    // `core.autocrlf=true` sous Windows) fait échouer `npm run format:check` sur presque
    // tous les fichiers : .gitattributes, .editorconfig et .vscode/settings.json l'évitent.
    const textFile = /\.(astro|js|mjs|ts|json|md|css|yml|yaml|svg|txt)$/;
    const tracked = execFileSync("git", ["ls-files", "-z"], {
      encoding: "utf-8",
    })
      .split("\0")
      .filter((file) => textFile.test(file));

    const withCrlf = tracked.filter((file) =>
      readFileSync(file, "utf-8").includes("\r\n"),
    );
    expect(withCrlf).toEqual([]);
  });
});
