import { getCollection } from "astro:content";
import { describe, expect, it } from "vitest";

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

  it("has a URL-safe slug for every post", async () => {
    const posts = await getCollection("blog");

    for (const post of posts) {
      expect(post.id, `${post.id} slug`).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
