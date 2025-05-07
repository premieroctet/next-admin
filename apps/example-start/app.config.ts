// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const prismaClientPath = require
  .resolve("@prisma/client")
  .replace(/@prisma(\/|\\)client(\/|\\).*/, ".prisma/client");

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
    ],
    ssr: {
      noExternal: ["react-datepicker"],
      external: ["@premieroctet/next-admin", "database"],
    },
    resolve: {
      alias: {
        ".prisma/client/index-browser": path.join(
          prismaClientPath,
          "index-browser.js"
        ),
      },
    },
  },
  server: {
    preset: "node-server",
  },
});
