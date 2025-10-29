// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkSectionize from "remark-sectionize";
import { remarkReadingTime } from "./remark-plugins/remark-reading-time";
import { remarkLastDateModified } from "./remark-plugins/remark-last-date-modified";

import sentry from "@sentry/astro";

// https://astro.build/config
/** @type {import('astro/config').AstroUserConfig} */
export default defineConfig({
  site: "https://billyle.dev",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
    sentry({
      project: "javascript-astro",
      org: "billy-gr",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
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
