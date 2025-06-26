import { RsbuildPluginAPI } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";
import { glob } from "glob";
import { rmSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const basePath = path.dirname(fileURLToPath(import.meta.url));

const themeCssPath = path.resolve(basePath, "src/theme.css");

export default defineConfig({
  lib: [
    {
      format: "esm",
      output: { filename: { js: "[name].mjs" } },
      bundle: false,
      dts: {
        bundle: false,
        abortOnError: false,
      },
    },
    {
      format: "cjs",
      output: { filename: { js: "[name].js" } },
      bundle: false,
    },
  ],
  output: {
    externals: [
      "@remix-run/react",
      "@tanstack/react-router",
      "react",
      "@prisma/client",
    ],
    copy: [
      {
        from: themeCssPath,
        to: path.resolve(basePath, "dist/theme.css"),
      },
    ],
  },
  source: {
    entry: {
      index: glob.sync("src/**/*.{ts,tsx}", {
        ignore: ["**/tests/*", "**/*.test.{ts,tsx}", "**/generated/*"],
      }),
    },
    /**
     * TODO: try to get rid of this at some point.
     * The issue we have by keeping the "tsconfig.json" is that the path aliases
     * are being replaced, so "@prisma/client" becomes "./generated/prisma/client" (for example).
     *
     * We cannot use the `api.onAfterBuild` hook to replace those, as it has an inconsistent behavior during development.
     */
    tsconfigPath: path.resolve(basePath, "tsconfig.build.json"),
  },
  plugins: [
    pluginReact(),
    {
      name: "rm-generated",
      setup(api: RsbuildPluginAPI) {
        api.onAfterBuild(() => {
          if (!api.getNormalizedConfig().dev.liveReload)
            rmSync(path.resolve(basePath, "dist/generated"), {
              recursive: true,
              force: true,
            });
        });
      },
    },
  ],
});
