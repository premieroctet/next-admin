import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import Logo from "../../components/Logo";
import "../globals.css";

export const metadata: Metadata = {
  title: "%s – Next Admin",
  keywords: "next, prisma, admin, database, next.js, back-office, cms",
  publisher: "Premier Octet",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head
        color={{
          hue: {
            light: 209,
            dark: 209,
          },
          saturation: {
            dark: 100,
            light: 100,
          },
        }}
      >
        <link rel="canonical" href="https://next-admin.vercel.app" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <body className={inter.className}>
        <Layout
          darkMode
          editLink={null}
          toc={{
            float: false,
          }}
          navbar={
            <Navbar
              logo={
                <div className="flex items-center gap-2">
                  <Logo width={45} />
                  <span className="font-semibold">Next Admin</span>
                </div>
              }
              projectLink="https://github.com/premieroctet/next-admin"
            />
          }
          footer={
            <Footer>
              MIT {new Date().getFullYear()} ©{" "}
              {
                <a href="https://premieroctet.com" target="_blank">
                  Premier Octet
                </a>
              }
              .
            </Footer>
          }
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/premieroctet/next-admin"
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
