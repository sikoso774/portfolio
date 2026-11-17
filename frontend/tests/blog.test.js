import { getCollection } from "astro:content";
import { describe, expect, it } from "vitest";
import { locales } from "../src/i18n";
import { getPosts, postSlug } from "../src/i18n/blog";

describe("blog collection", () => {
  it("loads at least the known articles", async () => {
    const posts = await getCollection("blog");
    expect(posts.length).toBeGreaterThanOrEqual(4);
  });

  it("has valid, non-empty frontmatter for every post", async () => {
    const posts = await getCollection("blog");

    for (const post of posts) {
      expect(post.data.title.length, `${post.id} title`).toBeGreaterThan(0);
      expect(
        post.data.description.length,
        `${post.id} description`,
      ).toBeGreaterThan(0);
      expect(post.data.pubDate, `${post.id} pubDate`).toBeInstanceOf(Date);
      expect(Array.isArray(post.data.tags), `${post.id} tags`).toBe(true);
    }
  });

  it("has a URL-safe slug for every post, under a language folder", async () => {
    const posts = await getCollection("blog");

    for (const post of posts) {
      const [lang, slug, ...rest] = post.id.split("/");
      expect(locales, `${post.id} language folder`).toContain(lang);
      expect(rest, `${post.id} nesting`).toEqual([]);
      expect(slug, `${post.id} slug`).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("has the same articles in every language", async () => {
    const slugsByLang = {};
    for (const lang of locales) {
      slugsByLang[lang] = (await getPosts(lang)).map(postSlug).sort();
    }

    expect(slugsByLang.en.length).toBeGreaterThanOrEqual(4);
    for (const lang of locales) {
      expect(slugsByLang[lang], `articles in ${lang}`).toEqual(slugsByLang.en);
    }
  });

  it('gives every article an "in short" summary, with the same points in each language', async () => {
    // Pyramide inversée : le problème et la solution doivent être visibles dès le haut de l'article.
    const en = new Map((await getPosts("en")).map((p) => [postSlug(p), p]));

    for (const lang of locales) {
      for (const post of await getPosts(lang)) {
        const id = `${lang}/${postSlug(post)}`;
        const summary = post.data.summary ?? [];
        expect(summary.length, `${id} summary`).toBeGreaterThanOrEqual(2);
        for (const item of summary) {
          expect(item.label.length, `${id} label`).toBeGreaterThan(0);
          expect(item.text.length, `${id} text`).toBeGreaterThan(20);
        }
        expect(summary.length, `${id} summary points`).toBe(
          en.get(postSlug(post)).data.summary.length,
        );
      }
    }
  });

  it("publishes each translation with the same date", async () => {
    const en = new Map((await getPosts("en")).map((p) => [postSlug(p), p]));

    for (const post of await getPosts("fr")) {
      const source = en.get(postSlug(post));
      expect(post.data.pubDate, postSlug(post)).toEqual(source.data.pubDate);
    }
  });
});
