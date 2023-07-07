import React from "react";
import { useRouter } from "next/router";
import Logo from "./components/Logo";

const config = {
  logo: <Logo width={45} />,
  project: {
    link: "https://github.com/premieroctet/next-admin",
  },
  docsRepositoryBase: "https://github.com/premieroctet/next-admin",
  footer: {
    text: "MIT 2020 © Premier Octet.",
  },
  darkMode: true,
  primaryHue: 290,
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        property="og:title"
        content="Next Admin, auto generated admin from Prisma for your Next.js app."
      />
      <meta
        property="og:description"
        content="Next Admin is a GUI built on top of Prisma and Next.js that allows you to easily manage and visualize your database."
      />
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
