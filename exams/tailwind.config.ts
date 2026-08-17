import type { Config } from "tailwindcss";

// Colour strategy: Restrained. Warm tinted neutrals carry every surface and
// gold is the single accent, earning its weight by being rare. The neutral ramp
// is tinted toward the gold hue rather than pure gray, so nothing on screen is
// a dead #FFF or #000 sitting next to a warm brand colour.
//
// The ramp keys are unchanged from the first build on purpose. Retinting the
// values in place re-skins every existing screen without touching their markup.

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
          50: "#FBF8F2",
          100: "#F5EEE0",
          200: "#EADCBF",
          300: "#DCC79E",
          400: "#D0B485",
          500: "#C5A572",
          600: "#AC8B52",
          700: "#856A3D",
          800: "#5E4B2C",
          900: "#3B301C",
        },
        // Warm tinted neutrals. dark-400 and up clear 4.5:1 on canvas.
        dark: {
          DEFAULT: "#1A1A1A",
          50: "#F6F4F1",
          100: "#E8E3DC",
          200: "#CFC8BE",
          300: "#A39B90",
          400: "#7A736A",
          500: "#57524B",
          600: "#3D3934",
          700: "#2A2724",
          800: "#1F1D1A",
          900: "#1A1A1A",
        },
        // Named surfaces so new work stops reaching for raw white.
        canvas: "#F6F4F1",
        surface: "#FFFDFB",
        line: "#E8E3DC",
        // Semantic, warmed to sit with the gold rather than fight it.
        success: {
          DEFAULT: "#2E7D5B",
          soft: "#E8F2ED",
          ink: "#1D5740",
        },
        danger: {
          DEFAULT: "#B3261E",
          soft: "#FBEBEA",
          ink: "#8C1D17",
        },
        warning: {
          DEFAULT: "#B8860B",
          soft: "#FBF2DE",
          ink: "#8A6408",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      // Elevation is declared once per element: a border or a shadow, never both.
      boxShadow: {
        card: "0 1px 2px rgba(26, 24, 20, 0.04), 0 10px 30px -18px rgba(26, 24, 20, 0.22)",
        lift: "0 2px 4px rgba(26, 24, 20, 0.05), 0 18px 40px -20px rgba(26, 24, 20, 0.28)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      },
      transitionTimingFunction: {
        // The one easing curve used across the product.
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        feedback: "120ms",
        state: "200ms",
        layout: "360ms",
      },
      letterSpacing: {
        display: "-0.03em",
      },
    },
  },
  plugins: [],
};

export default config;
