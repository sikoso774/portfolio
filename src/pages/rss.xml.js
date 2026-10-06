import { getCollection } from "astro:content";

// Flux RSS écrit à la main : évite d'ajouter @astrojs/rss pour 4 articles.
const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export async function GET({ site }) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const items = posts
    .map((post) => {
      const url = new URL(`/blog/${post.id}/`, site).toString();
      const categories = post.data.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");
      return `<item>
<title>${escapeXml(post.data.title)}</title>
<link>${url}</link>
<guid isPermaLink="true">${url}</guid>
<description>${escapeXml(post.data.description)}</description>
<pubDate>${post.data.pubDate.toUTCString()}</pubDate>
${categories}
</item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Zoléni Kokolo Zassi — Blog</title>
<link>${new URL("/blog/", site)}</link>
<description>Learning journal: notes and write-ups on 3D, development, and infrastructure.</description>
<language>en</language>
<atom:link href="${new URL("/rss.xml", site)}" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>
`;

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
