import { NextAdminOptions } from "@premieroctet/next-admin";
import { options } from "./options";

export const pageRouterOptions: NextAdminOptions = {
  ...options,
  title: "⚡️ My Admin Page Router",
  externalLinks: [
    {
      label: "Documentation",
      url: "https://next-admin.js.org",
    },
    {
      label: "App Router",
      url: "/admin",
    },
  ],
};
