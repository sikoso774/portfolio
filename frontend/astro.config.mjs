import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://zolenikokolo.com",
  trailingSlash: "always",
  // Anglais à la racine (URLs historiques inchangées), français sous /fr/.
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: { prefixDefaultLocale: false },
  },
  // Anciens slugs : c'étaient des articles FRANÇAIS déjà indexés par Google. On les redirige vers
  // la version française (/fr/) de l'article, avec son slug anglais : la langue du résultat est
  // conservée (vers /blog/…, un lecteur francophone arriverait sur l'article anglais).
  redirects: {
    "/blog/vocabulaire-3d/": "/fr/blog/3d-glossary/",
    "/blog/premiers-pas-blender/": "/fr/blog/blender-first-steps/",
    "/blog/cloudflare-cest-quoi/": "/fr/blog/what-is-cloudflare/",
    "/blog/github-pages-headers-securite-cloudflare/":
      "/fr/blog/github-pages-security-headers/",
  },
  // En dev, /api/contact est transmis au Worker lancé avec `npx wrangler dev`
  // (voir worker/README.md). En production, c'est une route Cloudflare.
  vite: {
    server: { proxy: { "/api": "http://localhost:8787" } },
  },
  integrations: [
    sitemap({
      // Ajoute les <xhtml:link rel="alternate" hreflang> dans le sitemap.
      i18n: { defaultLocale: "en", locales: { en: "en", fr: "fr" } },
      // Les pages déclarent aussi hreflang="x-default" (= anglais) dans leur <head> : le sitemap
      // doit dire la même chose, sinon les deux sources se contredisent.
      serialize(item) {
        // Le hook peut être appelé plusieurs fois sur le même élément : on reste idempotent.
        const en = item.links?.find((link) => link.lang === "en");
        const hasDefault = item.links?.some(
          (link) => link.lang === "x-default",
        );
        if (en && !hasDefault)
          item.links.push({ url: en.url, lang: "x-default" });
        return item;
      },
    }),
  ],
});
