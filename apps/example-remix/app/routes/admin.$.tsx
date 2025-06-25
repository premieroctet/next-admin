import { AdminComponentProps } from "@premieroctet/next-admin";
import { NextAdmin } from "@premieroctet/next-admin/adapters/remix";
import { getNextAdminProps } from "@premieroctet/next-admin/pageRouter";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prisma from "../prisma";
import { Dashboard } from "examples-common/components";
import en from "examples-common/messages/en";
import { options } from "../options";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return getNextAdminProps({
    url: request.url,
    apiBasePath: "/api/admin",
    basePath: "/admin",
    prisma,
    options,
    getMessages: async () => en.admin as unknown as Record<string, string>,
  });
};

export default function Admin() {
  const data = useLoaderData<typeof loader>();

  const logoutRequest: [RequestInfo, RequestInit] = [
    "/",
    {
      method: "POST",
    },
  ];

  return (
    <NextAdmin
      {...(data.props as AdminComponentProps)}
      dashboard={<Dashboard />}
      options={options}
      user={{
        data: {
          name: "John Doe",
        },
        logout: logoutRequest,
      }}
    />
  );
}
