import { describe, expect, it } from "vitest";
import en from "../src/i18n/en";
import fr from "../src/i18n/fr";
import {
  alternatePath,
  getLocale,
  localePath,
  localeStaticPaths,
  splitLocale,
  useT,
} from "../src/i18n";

// Liste « chemin -> valeur » de toutes les feuilles d'un dictionnaire.
function leaves(value, path = "") {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => leaves(item, `${path}[${i}]`));
  }
  return Object.entries(value).flatMap(([key, child]) =>
    leaves(child, path ? `${path}.${key}` : key),
  );
}

describe("dictionaries", () => {
  it("have exactly the same keys in English and French", () => {
    const enKeys = leaves(en).map(([path]) => path);
    const frKeys = leaves(fr).map(([path]) => path);
    expect(frKeys).toEqual(enKeys);
  });

  it("have no empty French string (except an intentionally empty one)", () => {
    const allowedEmpty = new Set(["hero.leadBefore"]);
    const empty = leaves(fr)
      .filter(([path, text]) => text.trim() === "" && !allowedEmpty.has(path))
      .map(([path]) => path);
    expect(empty).toEqual([]);
  });

  it("translate the prose: long French strings differ from the English ones", () => {
    const frByPath = new Map(leaves(fr));
    const untranslated = leaves(en)
      .filter(([path, text]) => text.length > 40 && frByPath.get(path) === text)
      .map(([path]) => path);
    expect(untranslated).toEqual([]);
  });
});

describe("locale helpers", () => {
  it("builds localized paths (English at the root, French under /fr/)", () => {
    expect(localePath("/", "en")).toBe("/");
    expect(localePath("/", "fr")).toBe("/fr/");
    expect(localePath("/about/", "en")).toBe("/about/");
    expect(localePath("/about/", "fr")).toBe("/fr/about/");
    expect(localePath("/rss.xml", "fr")).toBe("/fr/rss.xml");
  });

  it("splits a pathname into locale and path", () => {
    expect(splitLocale("/")).toEqual({ locale: "en", path: "/" });
    expect(splitLocale("/blog/x/")).toEqual({ locale: "en", path: "/blog/x/" });
    expect(splitLocale("/fr/")).toEqual({ locale: "fr", path: "/" });
    expect(splitLocale("/fr/blog/x/")).toEqual({
      locale: "fr",
      path: "/blog/x/",
    });
    // un chemin qui ressemble à /fr sans en être un
    expect(splitLocale("/frontend/")).toEqual({
      locale: "en",
      path: "/frontend/",
    });
  });

  it("maps a page to its other-language twin, both ways", () => {
    expect(alternatePath("/about/", "fr")).toBe("/fr/about/");
    expect(alternatePath("/fr/about/", "en")).toBe("/about/");
    expect(alternatePath("/fr/", "en")).toBe("/");
    expect(alternatePath("/", "fr")).toBe("/fr/");
  });

  it("falls back to English for an unknown locale", () => {
    expect(getLocale(undefined)).toBe("en");
    expect(getLocale("de")).toBe("en");
    expect(useT("fr")).toBe(fr);
    expect(useT(undefined)).toBe(en);
  });

  it("generates one static path per locale, English without a param", () => {
    expect(localeStaticPaths()).toEqual([
      { params: { locale: undefined } },
      { params: { locale: "fr" } },
    ]);
  });
});
