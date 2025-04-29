const defaultColors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
/* eslint-disable max-len */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@premieroctet/next-admin/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/examples-common/dist/components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("examples-common/preset")],
};
