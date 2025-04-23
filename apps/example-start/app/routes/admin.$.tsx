import { AdminComponentProps, NextAdmin } from "@premieroctet/next-admin";
import { NextAdminRouterAdapter } from "@premieroctet/next-admin/adapters/tanstack-router";
import { createFileRoute } from "@tanstack/react-router";
import { getWebRequest } from "@tanstack/react-start/server";
import { getNextAdminPropsFn } from "../functions/nextadmin";
import { options } from "../options";

export const Route = createFileRoute("/admin/$")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const req = getWebRequest();

    return getNextAdminPropsFn({
      data: {
        url: req!.url,
        splat: params._splat,
      },
    });
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    <NextAdminRouterAdapter>
      <NextAdmin
        {...(data.props as AdminComponentProps)}
        dashboard={<div></div>}
        options={options}
      />
    </NextAdminRouterAdapter>
  );
}
