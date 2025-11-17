import { MetaRecord } from "nextra";

export default {
  index: {
    type: "page",
    title: "Next Admin",
    display: "hidden",
    theme: {
      copyPage: true,
      toc: false,
      sidebar: false,
    },
  },
  docs: {
    title: " ",
    type: "page",
  },
  v4: {
    title: "v4",
    type: "page",
    display: "hidden",
  },
  changelog: {
    title: "Changelog",
    type: "page",
  },
  demo: {
    title: "Demo",
    type: "page",
    href: "https://next-admin-po.vercel.app",
  },
} satisfies MetaRecord;
