import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        ivory: {
          50: "#FAF9F5",
          100: "#F4F2EC",
          200: "#E8E4DB",
          300: "#D5CFC2",
        },
        ink: {
          900: "#141413",
          700: "#3D3B37",
          500: "#6E6B64",
          400: "#969289",
        },
        forest: {
          900: "#0B382B",
          800: "#0F4C3A",
          700: "#15634C",
          100: "#E6F0EC",
          50: "#F2F7F5",
        },
      },
    },
  },
  plugins: [],
};
export default config;
