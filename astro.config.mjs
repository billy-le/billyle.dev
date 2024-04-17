// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import remarkSectionize from "remark-sectionize";
import partytown from "@astrojs/partytown";

/** @type {import('astro/config').AstroUserConfig} */
// https://astro.build/config
export default defineConfig({
  site: "https://billyle.dev",
  integrations: [
    tailwind({
      nesting: true,
    }),
    sitemap(),
    partytown(),
  ],
  prefetch: true,
  markdown: {
    remarkPlugins: [remarkSectionize],
  },
});
