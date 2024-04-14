// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import remarkSectionize from "remark-sectionize";

/** @type {import('astro/config').AstroUserConfig} */
export default defineConfig({
  site: "https://billyle.dev",
  integrations: [
    tailwind({
      nesting: true,
    }),
    sitemap(),
  ],
  prefetch: true,
  markdown: {
    remarkPlugins: [remarkSectionize],
  },
});
