import { AdminComponentProps } from "@premieroctet/next-admin";
import { NextAdmin } from "@premieroctet/next-admin/adapters/tanstack-router";
import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "examples-common/components";
import { getNextAdminPropsFn } from "../functions/nextadmin";
import { options } from "../options";

export const Route = createFileRoute("/admin/$")({
  component: RouteComponent,
  loader: async ({ location }) => {
    return getNextAdminPropsFn({
      data: {
        url: location.href,
      },
    });
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();

  const logoutRequest: [RequestInfo, RequestInit] = [
    "/",
    {
      method: "POST",
    },
  ];

  return (
    <NextAdmin
      // @ts-expect-error
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
