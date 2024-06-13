import { Metadata, Viewport } from "next";
import nextAdmin from "@/actions/adminClass";

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  icons: "/favicon.ico",
};

export default async function AdminPage(props: any) {
  return <nextAdmin.NextAdmin />;
}
