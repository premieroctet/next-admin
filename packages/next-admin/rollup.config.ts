import typescript from "@rollup/plugin-typescript";
import { glob } from "glob";
import { defineConfig } from "rollup";
import preserveDirectives from "rollup-preserve-directives";
import { copyFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const basePath = path.dirname(fileURLToPath(import.meta.url));

const themeCssPath = path.resolve(basePath, "src/theme.css");

console.log("themeCssPath", themeCssPath);

export default defineConfig({
  plugins: [
    typescript(),
    preserveDirectives(),
    {
      name: "cp-theme-css",
      buildStart: function () {
        if (this.meta.watchMode) {
          this.addWatchFile(themeCssPath);
        }
      },
      buildEnd: function () {
        // TODO: this only work in watch mode but not in build mode ?????
        if (this.meta.watchMode) {
          copyFileSync(themeCssPath, path.resolve(basePath, "dist/theme.css"));
        }
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
