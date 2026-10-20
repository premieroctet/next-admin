import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";
import React from "react";
import Logo from "./components/Logo";

const BASE_URL = "https://next-admin.js.org";
const DEFAULT_DESCRIPTION =
  "Next-Admin provides a customizable and turnkey admin dashboard for applications built with Next.js and powered by the Prisma ORM.";

const config = {
  logo: (
    <div className="flex items-center gap-2">
      <Logo width={45} />
      <span className="font-semibold">Next Admin</span>
    </div>
  ),
  project: {
    link: "https://github.com/premieroctet/next-admin",
  },
  docsRepositoryBase: "https://github.com/premieroctet/next-admin",
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        {
          // eslint-disable-next-line react/jsx-no-target-blank
          <a href="https://premieroctet.com" target="_blank">
            Premier Octet
          </a>
        }
        .
      </span>
    ),
  },
  darkMode: true,
  primaryHue: 209,
  primarySaturation: 100,
  head: function useHead() {
    const { asPath } = useRouter();
    const { frontMatter, title: pageTitle } = useConfig();
    const path = asPath.split(/[?#]/)[0];
    const title = path === "/" ? "Next Admin" : `${pageTitle} – Next Admin`;
    const description = frontMatter.description ?? DEFAULT_DESCRIPTION;
    const hasMarkdownVersion = path === "/docs" || path.startsWith("/docs/");

    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="next, prisma, admin, database, next.js, back-office, cms" />
        <meta name="publisher" content="Premier Octet" />
        <link rel="canonical" href={`${BASE_URL}${path}`} />
        {hasMarkdownVersion && <link rel="alternate" type="text/markdown" href={`${path}.md`} />}
        <link rel="describedby" href="/llms.txt" />
        <link rel="icon" href="/logo.svg" />
      </>
    );
  },
  editLink: {
    component: () => null,
  },
  toc: {
    float: false,
  },
};

export default config;
