import intlPlugin from "next-intl/plugin";
import { withSuperjson } from "next-superjson";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const withNextIntl = intlPlugin("./i18n.ts");

const _require = createRequire(import.meta.url);

const prismaClientRequire = path.relative(
  fileURLToPath(import.meta.url),
  path.dirname(_require.resolve("@prisma/client"))
);

const monoRepoRoot = path.join(fileURLToPath(import.meta.url), "../../..");

const initialConfig = withNextIntl(
  withSuperjson({
    experimental: {
      swcPlugins: [
        [
          "next-superjson-plugin",
          {
            excluded: [],
          },
        ],
      ],
    },
  })
);

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  transpilePackages: ["@premieroctet/next-admin"],
  outputFileTracingRoot: monoRepoRoot,
  outputFileTracingIncludes: {
    "/\\[locale\\]/admin/\\[\\[\\.\\.\\.nextadmin\\]\\]": [
      path
        .join(prismaClientRequire, "runtime/*.postgresql.wasm")
        .replace("../", ""),
    ],
  },
};

const config = {
  ...initialConfig,
  ...baseConfig,
};

console.dir(config, { depth: null });

export default config;
