/** @type {import("prettier").Config} */
export default {
  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss", // MUST come last
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
