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

export default async function AdminPage({
  params,
  searchParams,
}: {
  readonly params: { [key: string]: string[] | string };
  readonly searchParams:
    | { [key: string]: string | string[] | undefined }
    | undefined;
}) {

  const nextAdminProps = await getNextAdminProps({
    basePath: "/admin",
    apiBasePath: "/api/admin",
    params: params.nextadmin as string[],
    searchParams,
    user: { 
      data: {
        name: "User",
      },
      logoutUrl: "/logout",
    },
    options,
    getMessages: () =>
      getMessages({ locale: params.locale as string }).then(
        (messages) => messages.admin as Record<string, string>
      ),
  });

  return <NextAdmin {...nextAdminProps} />;
}
