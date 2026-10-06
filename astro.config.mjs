import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://zolenikokolo.com",
  trailingSlash: "always",
  integrations: [sitemap()],
  server: {
    open: true,
  },
});
