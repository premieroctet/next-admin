const defaultColors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
/* eslint-disable max-len */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@premieroctet/next-admin/dist/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./options.{js,ts,jsx,tsx}",
    "./pageRouterOptions.{js,ts,jsx,tsx}",
  ],
  presets: [require("examples-common/preset")],
};
