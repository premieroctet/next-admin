import { MainLayout } from "@premieroctet/next-admin";
import { getMainLayoutProps } from "@premieroctet/next-admin/appRouter";
import { options } from "../../../../options";
import { prisma } from "../../../../prisma";

const CustomPage = async () => {
  const mainLayoutProps = getMainLayoutProps({
    basePath: "/admin",
    apiBasePath: "/api/admin",
    options,
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
    <MainLayout
      {...mainLayoutProps}
      user={{
        data: {
          name: "John Doe",
        },
        logout: ["/"],
      }}
    >
      <div className="p-10">
        <h1 className="mb-4 text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-gray-300">
          Dashboard
        </h1>
        <div className="mt-2">
          <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.name}
                  className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 dark:bg-gray-800"
                >
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    {item.name}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-200">
                    {item.stat}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CustomPage;
