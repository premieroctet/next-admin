const withNextIntl = require("next-intl/plugin")("./i18n.ts");
const { withSuperjson } = require("next-superjson");
const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

/** @type {import('next').NextConfig} */
module.exports = withNextIntl(
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
