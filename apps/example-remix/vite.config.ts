import { createRequire } from "node:module";
import path from "node:path";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

const require = createRequire(import.meta.url);
const prismaClientPath = require
  .resolve("@prisma/client")
  .replace(/@prisma(\/|\\)client(\/|\\).*/, ".prisma/client");

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: ["react-datepicker"],
    external: ["@premieroctet/next-admin"],
  },
  resolve: {
    alias: {
      ".prisma/client/index-browser": path.join(
        prismaClientPath,
        "index-browser.js"
      ),
    },
  },
});
