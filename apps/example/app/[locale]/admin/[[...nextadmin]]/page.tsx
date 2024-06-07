import { options } from "@/options";
import { NextAdmin, getNextAdminProps } from "@premieroctet/next-admin";
import { Metadata, Viewport } from "next";
import { getMessages } from "next-intl/server";

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  icons: "/favicon.ico",
};

export default async function AdminPage(props: any) {
  const nextAdminProps = await getNextAdminProps({
    basePath: "/admin",
    apiBasePath: "/api/admin",
    params: props?.params.nextadmin as string[],
    searchParams: props?.searchParams!,
    user: {
      data: {
        name: "User",
      },
      logoutUrl: "/logout",
    },
    options,
    getMessages: () =>
      getMessages({ locale: props?.params.locale as string }).then(
        (messages) => messages.admin as Record<string, string>
      ),
  });

  return <NextAdmin {...nextAdminProps} />;
}
