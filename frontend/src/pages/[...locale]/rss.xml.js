import {
  defaultLocale,
  getLocale,
  localePath,
  localeStaticPaths,
  useT,
} from "../../i18n";
import { getPosts, postPath, postSlug } from "../../i18n/blog";

// Flux RSS écrit à la main (évite @astrojs/rss pour quelques articles), un par langue :
// /rss.xml (anglais) et /fr/rss.xml.
const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export function getStaticPaths() {
  return localeStaticPaths();
}

export async function GET({ site, params }) {
  const lang = getLocale(params.locale ?? defaultLocale);
  const t = useT(lang);
  const posts = await getPosts(lang);

  const items = posts
    .map((post) => {
      const url = new URL(postPath(postSlug(post), lang), site).toString();
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
<title>${escapeXml(t.blog.rssTitle)}</title>
<link>${new URL(localePath("/blog/", lang), site)}</link>
<description>${escapeXml(t.blog.rssDescription)}</description>
<language>${lang}</language>
<atom:link href="${new URL(localePath("/rss.xml", lang), site)}" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>
`;

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
