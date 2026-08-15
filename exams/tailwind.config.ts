import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C5A572",
          50: "#FAF7F1",
          100: "#F3EDE0",
          200: "#E7DAC1",
          300: "#DAC7A2",
          400: "#CEB483",
          500: "#C5A572",
          600: "#B08E52",
          700: "#8B6F40",
          800: "#66512F",
          900: "#41341E",
        },
        dark: {
          DEFAULT: "#1A1A1A",
          50: "#F5F5F5",
          100: "#E5E5E5",
          200: "#C9C9C9",
          300: "#A3A3A3",
          400: "#6E6E6E",
          500: "#4A4A4A",
          600: "#333333",
          700: "#262626",
          800: "#1F1F1F",
          900: "#1A1A1A",
        },
        success: "#2E7D5B",
        danger: "#B3261E",
        warning: "#B8860B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(26, 26, 26, 0.06), 0 1px 3px rgba(26, 26, 26, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
