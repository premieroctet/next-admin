import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localeDetection: false,
  localePrefix: "always",
});

export const config = {
  matcher: [
    "/",
    "/(fr|en)/:path*",
    "/((?!_next|_vercel|pagerouter|.*\\..*).*)",
  ],
};
