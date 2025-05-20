import typescript from "@rollup/plugin-typescript";
import { glob } from "glob";
import { defineConfig } from "rollup";
import preserveDirectives from "rollup-preserve-directives";
import { copyFileSync } from "node:fs";

export default defineConfig({
  plugins: [
    typescript(),
    preserveDirectives(),
    {
      name: "cp-theme-css",
      buildStart: function () {
        this.addWatchFile("src/theme.css");
      },
      buildEnd: function () {
        copyFileSync("src/theme.css", "dist/theme.css");
      },
    },
  ],
  input: glob.sync("src/**/*.{ts,tsx}", {
    ignore: ["**/tests/*", "**/*.test.{ts,tsx}"],
  }),
  external: ["@remix-run/react", "@tanstack/react-router"],
  output: [
    {
      dir: "dist",
      format: "esm",
      preserveModules: true,
      entryFileNames: "[name].mjs",
    },
    {
      dir: "dist",
      format: "cjs",
      preserveModules: true,
      entryFileNames: "[name].js",
    },
  ],
});
