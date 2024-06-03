import { useRouter } from "next/router";
import React from "react";
import Logo from "./components/Logo";

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
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="keywords" content="next, prisma, admin, database, next.js, back-office, cms" />
      <meta name="publisher" content="Premier Octet" />
      <link rel="canonical" href="https://next-admin.vercel.app" />
      <link rel="icon" href="/logo.svg" />
    </>
  ),
  editLink: {
    component: () => null,
  },
  toc: {
    float: false,
  },
  useNextSeoProps: () => {
    const { asPath } = useRouter();
    if (asPath !== "/") {
      return {
        titleTemplate: "%s – Next Admin",
      };
    }
  },
};

export default config;
