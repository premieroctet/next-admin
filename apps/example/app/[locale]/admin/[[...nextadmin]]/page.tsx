import { Metadata, Viewport } from "next";
import NextAdmin from "../../../../nextadmin";

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  icons: "/favicon.ico",
};

export default async function AdminPage(props: {
  params: { [key: string]: string[] | string };
  searchParams: { [key: string]: string | string[] | undefined } | undefined;
}) {
  return <NextAdmin.Component {...props} />;
}
