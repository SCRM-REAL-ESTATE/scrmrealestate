import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "re-blue": "#1E62E0",
        "re-ivory": "#F8F6F1",
        "re-ink": "#1A1A1A",
        "re-stone": "#514D46",
        "re-stone-light": "#E8E5DF",
        "re-blue-accent": "#3080F8",
        "re-blue-light": "#EAF2FF",
        "re-gold-thin": "#C4A96C",
      },
      fontFamily: {
        // Display face — Urbanist (geometric, Montserrat-adjacent). The
        // utility keeps its old `font-serif` name so no component churn.
        serif: ["var(--font-display)", "Urbanist", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;
