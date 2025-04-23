import { AdminComponentProps, NextAdmin } from "@premieroctet/next-admin";
import { NextAdminRouterAdapter } from "@premieroctet/next-admin/adapters/tanstack-router";
import { createFileRoute } from "@tanstack/react-router";
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

  return (
    <NextAdminRouterAdapter>
      <NextAdmin
        // @ts-expect-error
        {...(data.props as AdminComponentProps)}
        dashboard={<div></div>}
        options={options}
      />
    </NextAdminRouterAdapter>
  );
}
