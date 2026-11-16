// Articles du blog : `src/content/blog/<langue>/<slug>.md`, mêmes slugs dans les
// deux langues pour que le lien « autre langue » et hreflang soient exacts.
import { getCollection, type CollectionEntry } from "astro:content";
import { localePath, type Locale } from "./index";

export type Post = CollectionEntry<"blog">;

export async function getPosts(locale: Locale): Promise<Post[]> {
  const posts = await getCollection(
    "blog",
    ({ id, data }) => id.startsWith(`${locale}/`) && !data.draft,
  );
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

/** `en/3d-glossary` -> `3d-glossary`. */
export function postSlug(post: Post): string {
  return post.id.split("/").slice(1).join("/");
}

export function postPath(slug: string, locale: Locale): string {
  return localePath(`/blog/${slug}/`, locale);
}
