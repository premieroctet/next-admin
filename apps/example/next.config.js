const withNextIntl = require("next-intl/plugin")("./i18n.ts");
const { withSuperjson } = require("next-superjson");

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
    }
  })
);
