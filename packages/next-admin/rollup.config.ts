import typescript from "@rollup/plugin-typescript";
import { glob } from "glob";
import { defineConfig } from "rollup";
import preserveDirectives from "rollup-preserve-directives";

export default defineConfig({
  plugins: [typescript(), preserveDirectives()],
  input: glob.sync("src/**/*.{ts,tsx}", {
    ignore: ["**/tests/*", "**/*.test.{ts,tsx}"],
  }),
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
