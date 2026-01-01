// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkSectionize from "remark-sectionize";
import { remarkReadingTime } from "./remark-plugins/remark-reading-time";
import { remarkLastDateModified } from "./remark-plugins/remark-last-date-modified";

import sentry from "@sentry/astro";
import path from "node:path";

// https://astro.build/config
/** @type {import('astro/config').AstroUserConfig} */
export default defineConfig({
  site: "https://billyle.dev",
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@ui": path.resolve("./src/ui"),
        "@layouts": path.resolve("./src/layouts"),
        "@assets": path.resolve("./src/assets"),
        "@data": path.resolve("./src/data"),
        "@styles": path.resolve("./src/styles"),
        "@utils": path.resolve("./src/utils"),
      },
    },
  },
  integrations: [sitemap(), sentry()],
  prefetch: true,
  markdown: {
    shikiConfig: {
      wrap: true,
    },
    remarkPlugins: [
      remarkSectionize,
      remarkReadingTime,
      remarkLastDateModified,
    ],
  },
  redirects: {
    "/posts": "/blog",
  },
});
