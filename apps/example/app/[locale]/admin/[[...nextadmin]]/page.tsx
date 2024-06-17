import { PageProps } from "@premieroctet/next-admin";
import { Metadata, Viewport } from "next";
import NextAdmin from "../../../../nextadmin";

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  icons: "/favicon.ico",
};

export default async function AdminPage(props: PageProps) {
  return <NextAdmin.Layout params={props?.params?.nextadmin} searchParams={undefined} />;
}
