import intlPlugin from "next-intl/plugin";
import { withSuperjson } from "next-superjson";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const withNextIntl = intlPlugin("./i18n.ts");

const _require = createRequire(import.meta.url);

const prismaClientRequire = path.relative(
  process.cwd(),
  path.dirname(_require.resolve("@prisma/client"))
);

const monoRepoRoot = path.join(process.cwd(), "../..");

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
    "**/*": [path.join(prismaClientRequire, "runtime/*.postgresql.wasm")],
  },
};

const config = {
  ...initialConfig,
  ...baseConfig,
};

export default config;
