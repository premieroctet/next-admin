import path from "path";
import { execa } from "execa";
import { writeFileSync } from "fs";
import {
  NEXTADMIN_TAILWIND_CONFIG_FILENAME,
  NEXTADMIN_OPTIONS_FILENAME,
  NEXTADMIN_CSS_FILENAME,
} from "./constants.js";

export const addTailwindCondig = async (basePath: string) => {
  const { stdout: libPath } =
    await execa`node -p path.dirname(require.resolve('@premieroctet/next-admin'))`;

  const content = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "${path.relative(basePath, libPath)}/**/*.{js,ts,jsx,tsx}",
    "./${NEXTADMIN_OPTIONS_FILENAME}.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {},
  presets: [require("@premieroctet/next-admin/preset")],
};
  `;

  writeFileSync(
    path.join(basePath, NEXTADMIN_TAILWIND_CONFIG_FILENAME),
    content
  );

  const adminCssContent = `
@config "./${NEXTADMIN_TAILWIND_CONFIG_FILENAME}";

@tailwind base;
@tailwind components;
@tailwind utilities;
  `;

  writeFileSync(path.join(basePath, NEXTADMIN_CSS_FILENAME), adminCssContent);
};
