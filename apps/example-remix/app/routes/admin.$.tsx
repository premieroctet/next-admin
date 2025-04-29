import { AdminComponentProps, NextAdmin } from "@premieroctet/next-admin";
import { NextAdminRouterAdapter } from "@premieroctet/next-admin/adapters/remix";
import { getNextAdminProps } from "@premieroctet/next-admin/pageRouter";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prisma from "database";
import { Dashboard } from "examples-common/components";
import { options } from "../options";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return getNextAdminProps({
    url: request.url,
    apiBasePath: "/api/admin",
    basePath: "/admin",
    prisma,
    options,
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
    <NextAdminRouterAdapter>
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
    </NextAdminRouterAdapter>
  );
}
