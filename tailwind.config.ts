import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hpBlue: "#024ad8",
        footer: "#191919",
        secondary:" #568393",
        tertiary: "#ff5050",
        tertiaryLight: "#f2ebdc",
        gray: "#e6e6e6"
      },
      keyframes: {
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY('-20px')" },
          "100%": { opacity: "1", transform: "translateY('0')" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        fadeDown: "fadeDown 0.8s ease-out forwards",
        fadeUp: "fadeUp 0.8s ease-out forwards",
        shimmer: "shimmer 3s linear infinite",
      },
      boxShadow: {
        neon: "0 0 0 2px rgba(0,150,214,.6), 0 0 15px rgba(0,150,214,.8)",
      },
      letterSpacing: {
        hp: "0.125rem",
      },
    },
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        "*": { letterSpacing: theme("letterSpacing.hp") },
      });
    }),
  ],
} satisfies Config;
