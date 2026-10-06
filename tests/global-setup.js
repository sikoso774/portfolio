import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync } from "node:fs";

// Vitest tourne en mode « dev » : `astro:content` y lit `.astro/data-store.json`, que seul
// `astro dev` écrit. Sans lui, `getCollection("blog")` renvoie 0 article sur un clone neuf.
// `astro sync` synchronise le contenu dans node_modules/.astro : on en recopie le résultat.
export default function setup() {
  execFileSync(process.execPath, ["node_modules/astro/bin/astro.mjs", "sync"], {
    stdio: "pipe",
  });
  mkdirSync(".astro", { recursive: true });
  copyFileSync("node_modules/.astro/data-store.json", ".astro/data-store.json");
}
