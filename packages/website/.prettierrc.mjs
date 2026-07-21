/** @type {import("prettier").Config} */
export default {
  // Resolved to absolute paths so the plugins load correctly even when
  // prettier/eslint is invoked from the monorepo root instead of this package.
  plugins: [
    import.meta.resolve("prettier-plugin-astro"),
    import.meta.resolve("prettier-plugin-tailwindcss"), // MUST come last
  ],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
  astroAllowShorthand: true,
  tailwindFunctions: ["twMerge", "clsx", "cn"],
};
