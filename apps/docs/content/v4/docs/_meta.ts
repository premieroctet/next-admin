import { MetaRecord } from "nextra";

export default {
  index: "Introduction",
  "getting-started": "Getting Started",
  api: {
    title: "API",
    theme: {
      breadcrumb: true,
      footer: true,
      sidebar: true,
      toc: true,
      pagination: true,
      copyPage: false,
    },
  },
  authentication: "Authentication",
  i18n: "I18n",

  theming: "Theming",
  glossary: "Glossary",
  route: "Route name",
  "edge-cases": "Edge cases",
  "code-snippets": "Code snippets",
} satisfies MetaRecord;
