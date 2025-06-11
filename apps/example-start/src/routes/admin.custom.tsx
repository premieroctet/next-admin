import { MainLayoutProps } from "@premieroctet/next-admin";
import { MainLayout } from "@premieroctet/next-admin/adapters/tanstack-router";
import { createFileRoute } from "@tanstack/react-router";
import { CustomPage } from "examples-common/components";
import { getNextAdminCustomPageFn } from "../functions/nextadmin";

export const Route = createFileRoute("/admin/custom")({
  component: RouteComponent,
  loader: async () => {
    return getNextAdminCustomPageFn();
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
    <MainLayout
      {...(data.mainLayoutProps as MainLayoutProps)}
      user={{
        data: {
          name: "John Doe",
        },
        logout: logoutRequest,
      }}
    >
      <CustomPage
        totalPosts={data.totalPosts}
        totalUsers={data.totalUsers}
        totalCategories={data.totalCategories}
      />
    </MainLayout>
  );
}
