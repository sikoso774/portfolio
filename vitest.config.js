import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    globalSetup: ["./tests/global-setup.js"],
  },
});
