import { defineConfig } from "@rslib/core";
import { glob } from "glob";

export default defineConfig({
  lib: [
    {
      format: "esm",
      output: { filename: { js: "[name].mjs" } },
      bundle: false,
      dts: true,
    },
    {
      format: "cjs",
      output: { filename: { js: "[name].js" } },
      bundle: false,
    },
  ],
  output: {
    externals: ["@prisma/client"],
    minify: {
      jsOptions: {
        minimizerOptions: {
          format: {
            comments: "all",
          },
        },
      },
    },
  },
  source: {
    entry: {
      index: glob.sync("**/*.{ts,tsx}", {
        ignore: ["prisma/**", "rslib.config.ts"],
      }),
    },
  },
});
