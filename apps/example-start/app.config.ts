// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

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
      external: ["@premieroctet/next-admin"],
    },
    build: {
      rollupOptions: {
        external: ["@premieroctet/next-admin"],
      },
    },
  },
  server: {
    preset: "node-server",
  },
});
