/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      primary: {
        "50": "#eef2ff",
        "100": "#e0e7ff",
        "200": "#c7d2fe",
        "300": "#a5b4fc",
        "400": "#818cf8",
        "500": "#6366f1",
        "600": "#4f46e5",
        "700": "#4338ca",
        "800": "#3730a3",
        "900": "#312e81",
      },
      danger: {
        "50": "#ffe3e3",
        "100": "#ffbdbd",
        "200": "#ff9b9b",
        "300": "#f86a6a",
        "400": "#ef4e4e",
        "500": "#e12d39",
        "600": "#cf1124",
        "700": "#ab091e",
        "800": "#8a041a",
        "900": "#610316",
      }
    },
  },
  plugins: [],
};
