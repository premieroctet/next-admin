import { defineConfig } from "@rslib/core";
import { glob } from "glob";
import { copyFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { pluginReact } from "@rsbuild/plugin-react";

const basePath = path.dirname(fileURLToPath(import.meta.url));

const themeCssPath = path.resolve(basePath, "src/theme.css");

export default defineConfig({
  lib: [
    {
      format: "esm",
      output: { filename: { js: "[name].mjs" } },
      bundle: false,
      dts: true,
    },
    { format: "cjs", output: { filename: { js: "[name].js" } }, bundle: false },
  ],
  output: {
    externals: ["@remix-run/react", "@tanstack/react-router", "react"],
  },
  source: {
    entry: {
      index: glob.sync("src/**/*.{ts,tsx}", {
        ignore: ["**/tests/*", "**/*.test.{ts,tsx}"],
      }),
    },
  },
  plugins: [
    pluginReact(),
    {
      name: "cp-theme-css",
      setup(api) {
        api.onAfterBuild(() => {
          copyFileSync(themeCssPath, path.resolve(basePath, "dist/theme.css"));
        });
      },
    },
  ],
});
