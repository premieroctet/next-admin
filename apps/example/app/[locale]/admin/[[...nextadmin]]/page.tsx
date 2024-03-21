import { NextAdmin } from "@premieroctet/next-admin";
import { getPropsFromParams } from "@premieroctet/next-admin/dist/appRouter";
import { getMessages } from "next-intl/server";
import { deleteItem, submitFormAction } from "@/actions/nextadmin";
import Dashboard from "@/components/Dashboard";
import { options } from "@/options";
import { prisma } from "@/prisma";
import schema from "@/prisma/json-schema/json-schema.json";

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: { [key: string]: string[] | string };
  searchParams: { [key: string]: string | string[] | undefined } | undefined;
}) {
  const props = await getPropsFromParams({
    params: params.nextadmin as string[],
    searchParams,
    options,
    prisma,
    schema,
    action: submitFormAction,
    deleteAction: deleteItem,
    getMessages: () =>
      getMessages({ locale: params.locale as string }).then(
        (messages) => messages.admin as Record<string, string>
      ),
    locale: params.locale as string,
  });

  return (
    <NextAdmin
      {...props}
      locale={params.locale as string}
      dashboard={Dashboard}
      user={{
        data: {
          name: "Example User",
        },
        logoutUrl: "/",
      }}
    />
  );
}
