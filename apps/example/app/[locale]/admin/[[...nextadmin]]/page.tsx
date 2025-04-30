import { options } from "@/options";
import { prisma } from "@/prisma";
import { PromisePageProps } from "@premieroctet/next-admin";
import { NextAdmin } from "@premieroctet/next-admin/adapters/next";
import { getNextAdminProps } from "@premieroctet/next-admin/appRouter";
import PageLoader from "@premieroctet/next-admin/pageLoader";
import { Dashboard } from "examples-common/components";
import { Metadata, Viewport } from "next";
import { getMessages } from "next-intl/server";
import "react-datepicker/dist/react-datepicker.css";

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  icons: "/assets/logo.svg",
};

export default async function AdminPage(props: PromisePageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const nextAdminProps = await getNextAdminProps({
    params: params.nextadmin,
    searchParams,
    basePath: "/admin",
    apiBasePath: "/api/admin",
    prisma,
    options,
    getMessages: (locale) =>
      getMessages({ locale }).then(
        (messages) => messages.admin as Record<string, string>
      ),
    locale: params.locale as string,
  });

  const logoutRequest: [RequestInfo, RequestInit] = [
    "/",
    {
      method: "POST",
    },
  ];

  return (
    <NextAdmin
      {...nextAdminProps}
      dashboard={<Dashboard />}
      user={{
        data: {
          name: "John Doe",
        },
        logout: logoutRequest,
      }}
      pageLoader={<PageLoader />}
    />
  );
}
