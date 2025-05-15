import { MainLayout } from "@premieroctet/next-admin/adapters/next";
import { getMainLayoutProps } from "@premieroctet/next-admin/appRouter";
import { CustomPage as CustomPageComponent } from "examples-common/components";
import { options } from "../../../../options";
import { prisma } from "../../../../prisma";

const CustomPage = async () => {
  const mainLayoutProps = await getMainLayoutProps({
    basePath: "/admin",
    apiBasePath: "/api/admin",
    options,
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
