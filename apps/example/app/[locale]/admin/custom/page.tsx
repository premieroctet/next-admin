import { PromisePageProps } from "@premieroctet/next-admin";
import { MainLayout } from "@premieroctet/next-admin/adapters/next";
import { getMainLayoutProps } from "@premieroctet/next-admin/appRouter";
import { CustomPage as CustomPageComponent } from "examples-common/components";
import { getMessages } from "next-intl/server";
import { options } from "../../../../options";
import { prisma } from "../../../../prisma";

const CustomPage = async (props: PromisePageProps) => {
  const params = await props.params;
  const mainLayoutProps = await getMainLayoutProps({
    basePath: "/admin",
    apiBasePath: "/api/admin",
    options,
    getMessages: (locale) =>
      getMessages({ locale }).then(
        (messages) => messages.admin as Record<string, string>
      ),
    locale: params.locale as string,
  });

  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  const totalCategories = await prisma.category.count();

  return (
    <MainLayout
      {...mainLayoutProps}
      user={{
        data: {
          name: "John Doe",
        },
        logout: ["/"],
      }}
    >
      <CustomPageComponent
        totalPosts={totalPosts}
        totalUsers={totalUsers}
        totalCategories={totalCategories}
      />
    </MainLayout>
  );
};

export default CustomPage;
