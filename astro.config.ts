// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import remarkSectionize from "remark-sectionize";
import { remarkReadingTime } from "./remark-plugins/remark-reading-time";
import { remarkLastDateModified } from "./remark-plugins/remark-last-date-modified";

// https://astro.build/config
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
    remarkPlugins: [
      remarkSectionize,
      remarkReadingTime,
      remarkLastDateModified,
    ],
  },
});
