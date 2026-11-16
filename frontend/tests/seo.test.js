import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { blogPosting, profilePage } from "../src/utils/schema";
import en from "../src/i18n/en";
import fr from "../src/i18n/fr";

const SITE = new URL("https://zolenikokolo.com");
const OUT_DIR = ".vitest-dist";

const read = (file) => readFileSync(join(OUT_DIR, file), "utf-8");

// Slugs partagés par les articles anglais et français.
const blogSlugs = readdirSync(join("src", "content", "blog", "en"))
  .filter((name) => name.endsWith(".md"))
  .map((name) => name.replace(/\.md$/, ""));

function leaves(value, path = "") {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value))
    return value.flatMap((item, i) => leaves(item, `${path}[${i}]`));
  return Object.entries(value).flatMap(([key, child]) =>
    leaves(child, path ? `${path}.${key}` : key),
  );
}

function extractGraph(html) {
  const match = html.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  );
  return JSON.parse(match[1])["@graph"];
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      return entry === "_astro" || entry === "assets" ? [] : htmlFiles(path);
    }
    return path.endsWith(".html") ? [path] : [];
  });
}

describe("built site SEO", () => {
  beforeAll(async () => {
    execFileSync(
      process.execPath,
      ["node_modules/astro/bin/astro.mjs", "build", "--outDir", OUT_DIR],
      { stdio: "pipe" },
    );
  }, 120_000);

  afterAll(() => {
    rmSync(OUT_DIR, { recursive: true, force: true });
  });

  it("noindexes the 404 page but indexes the others", () => {
    expect(read("404.html")).toContain('content="noindex, follow"');
    expect(read("index.html")).toContain('content="index, follow"');
    expect(read("about/index.html")).toContain('content="index, follow"');
  });

  it("uses a trailing-slash canonical on every page", () => {
    for (const file of htmlFiles(OUT_DIR).filter(
      (f) => !f.endsWith("404.html"),
    )) {
      const html = readFileSync(file, "utf-8");
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
      expect(canonical, file).toMatch(/\/$/);
    }
  });

  it("never links internally to a route without trailing slash", () => {
    for (const file of htmlFiles(OUT_DIR)) {
      const html = readFileSync(file, "utf-8");
      const hrefs = [...html.matchAll(/<a [^>]*href="(\/[^"#?]*)"/g)].map(
        (match) => match[1],
      );
      const bare = hrefs.filter(
        (href) => !href.endsWith("/") && !/\.[a-z0-9]+$/i.test(href),
      );
      expect(bare, file).toEqual([]);
    }
  });

  it("emits a Person + WebSite + ProfilePage graph on the homepage", () => {
    const graph = extractGraph(read("index.html"));
    const types = graph.map((node) => node["@type"]);
    expect(types).toEqual(["Person", "WebSite", "ProfilePage"]);

    const person = graph[0];
    expect(person["@id"]).toBe("https://zolenikokolo.com/#person");
    expect(person.alternateName).toContain("Zoleni Kokolo Zassi");
    expect(graph[2].mainEntity).toEqual({ "@id": person["@id"] });
  });

  it("marks articles as og:type article with a BlogPosting", () => {
    const html = read("blog/3d-glossary/index.html");
    expect(html).toContain('<meta property="og:type" content="article"');
    expect(html).toContain("article:published_time");
    expect(html).toContain('rel="author"');

    const posting = extractGraph(html).find(
      (node) => node["@type"] === "BlogPosting",
    );
    expect(posting.author).toEqual({
      "@id": "https://zolenikokolo.com/#person",
    });
    expect(posting.url).toBe("https://zolenikokolo.com/blog/3d-glossary/");
  });

  it("publishes an RSS feed linked from the head, with every post", () => {
    expect(read("index.html")).toContain('href="/rss.xml"');
    const feed = read("rss.xml");
    expect(feed.match(/<item>/g).length).toBeGreaterThanOrEqual(4);
    expect(feed).toContain(
      "<link>https://zolenikokolo.com/blog/3d-glossary/</link>",
    );
  });

  it("never leaks truncated <svg> tags as visible text", () => {
    // Régression : prettier-plugin-astro amputait `<svg w` devant un prettier-ignore.
    const truncated = /(^|[>\s])(idth|dth|le|vg width)=?"/;
    for (const file of htmlFiles(OUT_DIR)) {
      expect(readFileSync(file, "utf-8"), file).not.toMatch(truncated);
    }
  });

  it("redirects the old French slugs to the English ones", () => {
    const redirects = {
      "blog/vocabulaire-3d": "/blog/3d-glossary/",
      "blog/premiers-pas-blender": "/blog/blender-first-steps/",
      "blog/cloudflare-cest-quoi": "/blog/what-is-cloudflare/",
      "blog/github-pages-headers-securite-cloudflare":
        "/blog/github-pages-security-headers/",
    };
    const sitemap = read("sitemap-0.xml");

    for (const [oldPath, target] of Object.entries(redirects)) {
      const html = read(`${oldPath}/index.html`);
      expect(html, oldPath).toContain(`url=${target}`);
      expect(sitemap, oldPath).not.toContain(oldPath);
      expect(sitemap, target).toContain(target);
    }
  });

  it("serves every page in French under /fr/ with <html lang>", () => {
    const pages = [
      "",
      "about/",
      "skills/",
      "experience/",
      "projects/",
      "contact/",
      "blog/",
    ];
    for (const page of pages) {
      const en = read(`${page}index.html`);
      const fr = read(`fr/${page}index.html`);
      expect(en, page).toContain('<html lang="en"');
      expect(fr, page).toContain('<html lang="fr"');
      expect(fr, page).toContain(
        `<link rel="canonical" href="https://zolenikokolo.com/fr/${page}"`,
      );
    }
    for (const slug of blogSlugs) {
      expect(read(`fr/blog/${slug}/index.html`), slug).toContain(
        '<html lang="fr"',
      );
    }
  });

  it("declares reciprocal hreflang (and x-default) on every translated page", () => {
    const pages = new Map(); // canonical -> { file, alternates: Map(hreflang -> url) }
    for (const file of htmlFiles(OUT_DIR)) {
      const html = readFileSync(file, "utf-8");
      if (html.includes('http-equiv="refresh"')) continue; // page de redirection
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
      const alternates = new Map(
        [
          ...html.matchAll(
            /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g,
          ),
        ].map((m) => [m[1], m[2]]),
      );
      pages.set(canonical, { file, alternates });
    }

    let checked = 0;
    for (const [canonical, { file, alternates }] of pages) {
      if (alternates.size === 0) continue; // 404
      checked++;
      expect([...alternates.keys()].sort(), file).toEqual([
        "en",
        "fr",
        "x-default",
      ]);
      expect(alternates.get("x-default"), file).toBe(alternates.get("en"));
      expect([...alternates.values()], `${file} self-reference`).toContain(
        canonical,
      );
      for (const url of alternates.values()) {
        const twin = pages.get(url);
        expect(twin, `${file} -> ${url} must exist`).toBeDefined();
        expect(
          [...twin.alternates.values()],
          `${url} must point back`,
        ).toContain(canonical);
      }
    }
    expect(checked).toBeGreaterThanOrEqual(2 * (7 + blogSlugs.length));
  });

  it("links the language switcher to the other-language twin", () => {
    const en = read("about/index.html");
    const fr = read("fr/about/index.html");
    expect(en).toMatch(
      /<a href="\/fr\/about\/" hreflang="fr"[^>]*data-astro-reload/,
    );
    expect(fr).toMatch(
      /<a href="\/about\/" hreflang="en"[^>]*data-astro-reload/,
    );
    expect(read("fr/blog/3d-glossary/index.html")).toMatch(
      /<a href="\/blog\/3d-glossary\/" hreflang="en"/,
    );
  });

  it("keeps French pages free of English interface strings", () => {
    const decode = (html) =>
      html
        .replaceAll("&amp;", "&")
        .replaceAll("&#39;", "'")
        .replaceAll("&quot;", '"')
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">");
    const frByPath = new Map(leaves(fr));
    // Le nom du site est un nom propre : il peut légitimement être identique en anglais
    // (ex. `meta.home.title`) et apparaître tel quel sur les pages françaises.
    const englishOnly = leaves(en).filter(
      ([path, text]) =>
        text.length >= 12 &&
        text !== en.meta.siteName &&
        frByPath.get(path) !== text,
    );

    for (const page of [
      "",
      "about/",
      "skills/",
      "experience/",
      "projects/",
      "contact/",
      "blog/",
    ]) {
      // Texte visible uniquement : le JSON-LD garde des noms de sujets en anglais.
      const html = decode(
        read(`fr/${page}index.html`).replace(/<script[\s\S]*?<\/script>/g, ""),
      );
      const leaked = englishOnly
        .filter(([, text]) => html.includes(text))
        .map(([path]) => path);
      expect(leaked, `fr/${page}`).toEqual([]);
    }
  });

  it("publishes a French RSS feed with French article URLs", () => {
    const feed = read("fr/rss.xml");
    expect(feed).toContain("<language>fr</language>");
    expect(feed.match(/<item>/g).length).toBe(blogSlugs.length);
    for (const slug of blogSlugs) {
      expect(feed).toContain(
        `<link>https://zolenikokolo.com/fr/blog/${slug}/</link>`,
      );
    }
    expect(read("fr/index.html")).toContain('href="/fr/rss.xml"');
  });

  it("lists every page with its alternates in the sitemap", () => {
    const sitemap = read("sitemap-0.xml");
    expect(sitemap).toContain(
      '<loc>https://zolenikokolo.com/fr/about/</loc><xhtml:link rel="alternate" hreflang="en" href="https://zolenikokolo.com/about/"/>',
    );
    for (const slug of blogSlugs) {
      expect(sitemap).toContain(
        `<loc>https://zolenikokolo.com/fr/blog/${slug}/</loc>`,
      );
    }
  });

  it("keeps the 404 page out of the sitemap", () => {
    expect(read("sitemap-0.xml")).not.toContain("404");
  });
});

describe("schema helpers", () => {
  it("builds a ProfilePage pointing at the Person", () => {
    const page = profilePage(SITE, "/about/", "About");
    expect(page.url).toBe("https://zolenikokolo.com/about/");
    expect(page.mainEntity).toEqual({
      "@id": "https://zolenikokolo.com/#person",
    });
  });

  it("falls back to pubDate when there is no updatedDate", () => {
    const post = blogPosting({
      site: SITE,
      pathname: "/blog/x/",
      title: "t",
      description: "d",
      image: new URL("/og.png", SITE),
      tags: ["Blender", "3D"],
      pubDate: new Date("2026-06-11"),
    });
    expect(post.keywords).toBe("Blender, 3D");
    expect(post.dateModified).toBe(post.datePublished);
  });
});
