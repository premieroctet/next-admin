import { MainLayoutProps } from "@premieroctet/next-admin";
import { MainLayout } from "@premieroctet/next-admin/adapters/remix";
import { getMainLayoutProps } from "@premieroctet/next-admin/pageRouter";
import { useLoaderData } from "@remix-run/react";
import prisma from "../prisma";
import { CustomPage } from "examples-common/components";
import { options } from "../options";

export const loader = async () => {
  const mainLayoutProps = await getMainLayoutProps({
    apiBasePath: "/api/admin",
    basePath: "/admin",
    options,
  });

  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  const totalCategories = await prisma.category.count();

  return {
    mainLayoutProps,
    totalUsers,
    totalPosts,
    totalCategories,
  };
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
