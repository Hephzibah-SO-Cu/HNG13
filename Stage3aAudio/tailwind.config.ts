// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // --- BREAKPOINTS ---
    screens: {
      md: "768px",  // Tablet
      lg: "1440px", // Desktop
    },
    // --- COLORS ---
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: "#D87D4A",
      "primary-light": "#FBAF85",
      black: "#101010", // Main black
      "black-pure": "#000000",
      "gray-light": "#F1F1F1",
      "gray-darker": "#4C4C4C",
      "white-off": "#FAFAFA",
      white: "#FFFFFF",
    },
    // --- TYPOGRAPHY ---
    fontFamily: {
      sans: ["Manrope", "sans-serif"],
    },
    fontSize: {
      // [fontSize, { lineHeight, letterSpacing, fontWeight }]
      "h1": ["56px", { lineHeight: "58px", letterSpacing: "2px", fontWeight: "700" }],
      "h2": ["40px", { lineHeight: "44px", letterSpacing: "1.5px", fontWeight: "700" }],
      "h3": ["32px", { lineHeight: "36px", letterSpacing: "1.15px", fontWeight: "700" }],
      "h4": ["28px", { lineHeight: "38px", letterSpacing: "2px", fontWeight: "700" }],
      "h5": ["24px", { lineHeight: "33px", letterSpacing: "1.7px", fontWeight: "700" }],
      "h6": ["18px", { lineHeight: "24px", letterSpacing: "1.3px", fontWeight: "700" }],
      "overline": ["14px", { lineHeight: "19px", letterSpacing: "10px", fontWeight: "400" }],
      "sub": ["13px", { lineHeight: "25px", letterSpacing: "1px", fontWeight: "700" }],
      "body": ["15px", { lineHeight: "25px", fontWeight: "500" }],
    },
  },
  plugins: [],
};
export default config;
