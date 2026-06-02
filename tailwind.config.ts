import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  darkMode: "class", // ✅ OBLIGATOIRE pour le dark mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      inter: ["Inter var", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      minHeight: {
        screen: "100vh",
      },
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          50:  "#eef0fb",
          100: "#d5d9f5",
          200: "#aab3eb",
          300: "#7f8de1",
          400: "#5467d7",
          500: "#2D3A96",
          600: "#243080",
          700: "#1b2560",
          800: "#121940",
          900: "#090d20",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          50:  "#e8faf2",
          100: "#c3f2dc",
          200: "#87e5b9",
          300: "#4bd896",
          400: "#37d279",
          500: "#22a35d",
          600: "#1a7d47",
          700: "#125630",
          800: "#0a301a",
          900: "#030d07",
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          50:  "#fff5ef",
          100: "#ffe5d3",
          200: "#ffcba7",
          300: "#ffb17b",
          400: "#ffb795",
          500: "#fe9261",
          600: "#e06b3a",
          700: "#b34d20",
          800: "#7a3212",
          900: "#3d1809",
        },
      },

      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
        },
        moveRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },

      animation: {
        shake: "shake 0.5s ease-in-out infinite",
        moveRight: "moveRight 2s ease-in-out",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },

    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1400px",
      "3xl": "1600px",
      "4xl": "1800px",
    },
  },
  plugins: [],
};

export default config;
