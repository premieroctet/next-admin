import nextra from "nextra";

const config = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
});

export default config({
  reactStrictMode: true,
});
