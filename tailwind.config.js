/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        stone: {
          925: "#1a1917",
        },
        sage: {
          50: "#f4f7f4",
          100: "#e8f0e7",
          200: "#d0e0ce",
          300: "#a9c4a6",
          400: "#7da479",
          500: "#5c7c5a",
          600: "#496347",
          700: "#3b4f39",
          800: "#314130",
          900: "#293629",
        },
        warm: {
          50: "#faf8f5",
          100: "#f5f0e6",
          200: "#ebe0cd",
          300: "#d4c4a4",
          400: "#b9a37a",
          500: "#a38d5e",
          600: "#8a7449",
          700: "#715d3a",
          800: "#5e4d32",
          900: "#4e402b",
        },
      },
    },
  },
  plugins: [],
};
