import { MainLayout } from "@premieroctet/next-admin";
import { createRandomPost } from "../../../../actions/posts";
import { getMainLayoutProps } from "@premieroctet/next-admin/dist/mainLayout";
import { prisma } from "../../../../prisma";
import { options } from "../../../../options";

const CustomPage = async () => {
  const mainLayoutProps = getMainLayoutProps({ options, isAppDir: true });

  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  const totalCategories = await prisma.category.count();

  return (
    <MainLayout {...mainLayoutProps}>
      <div>
        <h1 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4">
          Custom page
        </h1>
        <div className="mt-2">
          <h2 className="text-base font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-2">
            Custom queries
          </h2>
          <p className="text-md">Total Users: {totalUsers}</p>
          <p className="text-md">Total Posts: {totalPosts}</p>
          <p className="text-md">Total Categories: {totalCategories}</p>
        </div>
        <div className="mt-2">
          <h2 className="text-base font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-2">
            Custom actions
          </h2>
          <form action={createRandomPost} className="mt-2">
            <button
              type="submit"
              className="bg-indigo-500 p-2 text-white hover:bg-indigo-700 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              Create random post
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CustomPage;
