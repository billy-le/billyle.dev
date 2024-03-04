import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem",
      },
      center: true,
    },
    extend: {
      fontFamily: {
        inter: "var(--inter)",
        vidaloka: "var(--vidaloka)",
        "space-android": "var(--space-android)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [typography()],
};
