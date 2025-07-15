import { defineConfig } from "@rslib/core";
import { glob } from "glob";
import path from "path";

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
    copy: {
      patterns: [
        {
          from: "*.node",
          context: path.join(__dirname, "generated", "prisma"),
          to: "generated/prisma",
        },
      ],
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
