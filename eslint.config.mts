import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";
import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";

// Reuse .prettierignore as the single source of truth for generated files
// that neither ESLint nor Prettier should touch (e.g. Astro's `.astro/` output).
const prettierIgnorePath = path.resolve(import.meta.dirname, ".prettierignore");

export default defineConfig([
  includeIgnoreFile(prettierIgnorePath),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    settings: { react: { version: "detect" } },
  },
  eslintPluginPrettierRecommended,
]);
