// Fabriques d'entités schema.org, rattachées au Person/WebSite définis dans Layout.astro
// via leurs @id (`<site>#person`, `<site>#website`).

export function profilePage(site: URL, pathname: string, name: string) {
  const url = new URL(pathname, site).toString();
  return {
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    url,
    name,
    isPartOf: { "@id": `${site}#website` },
    mainEntity: { "@id": `${site}#person` },
  };
}

interface BlogPostingInput {
  site: URL;
  pathname: string;
  title: string;
  description: string;
  image: URL;
  tags: string[];
  pubDate: Date;
  updatedDate?: Date;
}

export function blogPosting({
  site,
  pathname,
  title,
  description,
  image,
  tags,
  pubDate,
  updatedDate,
}: BlogPostingInput) {
  const url = new URL(pathname, site).toString();
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: title,
    description,
    image: image.toString(),
    keywords: tags.join(", "),
    inLanguage: "en",
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate ?? pubDate).toISOString(),
    author: { "@id": `${site}#person` },
    publisher: { "@id": `${site}#person` },
    isPartOf: { "@id": `${site}#website` },
  };
}
