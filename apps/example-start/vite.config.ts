/// <reference types="vite/client" />
import tailwindcss from "@tailwindcss/vite";
import { createRequire } from "node:module";
import path from "node:path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

const require = createRequire(import.meta.url);
const prismaClientPath = require
  .resolve("@prisma/client")
  .replace(/@prisma(\/|\\)client(\/|\\).*/, ".prisma/client");

export default defineConfig({
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
  ],
  ssr: {
    noExternal: ["react-datepicker"],
    external: ["@premieroctet/next-admin", "database"],
  },
  // resolve: {
  //   alias: {
  //     ".prisma/client/index-browser": path.join(
  //       prismaClientPath,
  //       "index-browser.js"
  //     ),
  //   },
  // },
});
