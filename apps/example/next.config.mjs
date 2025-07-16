import intlPlugin from "next-intl/plugin";
import { withSuperjson } from "next-superjson";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const withNextIntl = intlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const config = withNextIntl(
  withSuperjson({
    reactStrictMode: true,
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
    transpilePackages: ["@premieroctet/next-admin"],
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.plugins = [...config.plugins, new PrismaPlugin()];
      }

      return config;
    },
  })
);

export default config;
