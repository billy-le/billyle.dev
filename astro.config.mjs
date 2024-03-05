import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

/** @type {import('astro/config').AstroUserConfig} */
export default defineConfig({
  site: "https://billyle.dev",
  integrations: [
    tailwind({
      nesting: true,
    }),
    sitemap(),
    robotsTxt(),
  ],
  prefetch: true,
});
