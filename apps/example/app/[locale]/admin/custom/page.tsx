import { getMainLayoutProps, MainLayout } from "@premieroctet/next-admin";
import { getMessages } from "next-intl/server";
import { options } from "../../../../options";
import { prisma } from "../../../../prisma";

const CustomPage = async ({
  params: { locale },
}: {
  readonly params: { locale: string };
}) => {
  const mainLayoutProps = await getMainLayoutProps({
    basePath: "/admin",
    apiBasePath: "/api/admin",
    user: {
      data: {
        name: "User",
      },
      logoutUrl: "/logout",
    },
    options,
    getMessages: () =>
      getMessages({ locale }).then(
        (messages) => messages.admin as Record<string, string>
      ),
  });

  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  const totalCategories = await prisma.category.count();

  const stats = [
    { name: "Total Users", stat: totalUsers },
    { name: "Total Posts", stat: totalPosts },
    { name: "Total Categories", stat: totalCategories },
  ];

  return (
    <MainLayout {...mainLayoutProps}>
      <div className="p-10">
        <h1 className="mb-4 text-xl font-bold leading-7 text-gray-900 dark:text-gray-300 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard
        </h1>
        <div className="mt-2">
          <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Users
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-200">
                  8
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Posts
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-200">
                  59
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Categories
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-200">
                  1
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CustomPage;
