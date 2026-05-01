import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#C5A572",
        dark: "#1A1A1A",
        "accent-dark": "#0D0D0D",
        // Stitch design system
        primary: "#e4c28c",
        "primary-container": "#c5a572",
        "on-primary": "#412d04",
        "on-primary-container": "#513b11",
        secondary: "#41e575",
        "secondary-container": "#06c85d",
        "on-secondary": "#003915",
        "on-secondary-container": "#004d1f",
        tertiary: "#dcc39d",
        "tertiary-container": "#bea682",
        "on-tertiary": "#3d2e13",
        background: "#131313",
        surface: "#131313",
        "surface-container": "#20201f",
        "surface-container-low": "#1c1b1b",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353535",
        "surface-variant": "#353535",
        "surface-bright": "#393939",
        "surface-dim": "#131313",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#d1c5b6",
        outline: "#998f82",
        "outline-variant": "#4d463b",
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        "inverse-surface": "#e5e2e1",
        "inverse-on-surface": "#313030",
        "inverse-primary": "#745a2e",
        "primary-fixed": "#ffdeab",
        "primary-fixed-dim": "#e4c28c",
        "on-primary-fixed": "#271900",
        "on-primary-fixed-variant": "#5a4319",
        "secondary-fixed": "#66ff8e",
        "secondary-fixed-dim": "#3de273",
        "on-secondary-fixed": "#002109",
        "on-secondary-fixed-variant": "#005322",
        "tertiary-fixed": "#f9dfb8",
        "tertiary-fixed-dim": "#dcc39d",
        "on-tertiary-fixed": "#261902",
        "on-tertiary-fixed-variant": "#554427",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
};
export default config;
