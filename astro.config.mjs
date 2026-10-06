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
  // Anciens slugs français (déjà indexés par Google) → slugs anglais.
  redirects: {
    "/blog/vocabulaire-3d/": "/blog/3d-glossary/",
    "/blog/premiers-pas-blender/": "/blog/blender-first-steps/",
    "/blog/cloudflare-cest-quoi/": "/blog/what-is-cloudflare/",
    "/blog/github-pages-headers-securite-cloudflare/":
      "/blog/github-pages-security-headers/",
  },
  integrations: [
    sitemap({
      // Ajoute les <xhtml:link rel="alternate" hreflang> dans le sitemap.
      i18n: { defaultLocale: "en", locales: { en: "en", fr: "fr" } },
    }),
  ],
});
