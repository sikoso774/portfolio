import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { blogPosting, profilePage } from "../src/utils/schema";

const SITE = new URL("https://zolenikokolo.com");
const OUT_DIR = ".vitest-dist";

const read = (file) => readFileSync(join(OUT_DIR, file), "utf-8");

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
