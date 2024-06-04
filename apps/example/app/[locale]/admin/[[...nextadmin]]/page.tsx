import { options } from "@/options";
import schema from "@/prisma/json-schema/json-schema.json";
import { NextAdmin, Schema } from "@premieroctet/next-admin";
import { Metadata, Viewport } from "next";

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
  // const props = await getPropsFromParams({
  //   params: params.nextadmin as string[],
  //   searchParams,
  //   options,
  //   prisma,
  //   schema,
  //   action: submitFormAction,
  //   deleteAction: deleteItem,
  //   getMessages: () =>
  //     getMessages({ locale: params.locale as string }).then(
  //       (messages) => messages.admin as Record<string, string>
  //     ),
  //   locale: params.locale as string,
  //   searchPaginatedResourceAction: searchResource,
  // });

  return (
    <NextAdmin
      basePath="/admin"
      apiBasePath="/api/admin"
      params={params.nextadmin as string[]}
      searchParams={searchParams}
      schema={schema as Schema}
      options={options}
      // getMessages={() =>
      //   getMessages({ locale: params.locale as string }).then(
      //     (messages) => messages.admin as Record<string, string>
      //   )}
      locale={params.locale as string}
      user={{
        data: {
          name: "John Doe",
        },
        logoutUrl: "/",
      }}
    />
  );
}
