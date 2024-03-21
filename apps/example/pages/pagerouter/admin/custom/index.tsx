import { MainLayout, MainLayoutProps } from "@premieroctet/next-admin";
import { getMainLayoutProps } from "@premieroctet/next-admin/dist/mainLayout";
import { GetServerSideProps } from "next";
import { prisma } from "../../../../prisma";
import { options } from "../../../../options";
import "../../../../styles.css";

type Props = MainLayoutProps & {
  totalUsers: number;
  totalPosts: number;
  totalCategories: number;
};

const pageOptions = {
  ...options,
  basePath: "/pagerouter/admin",
};

const CustomPage = ({
  totalCategories,
  totalUsers,
  totalPosts,
  ...mainLayoutProps
}: Props) => {
  return (
    <MainLayout
      {...mainLayoutProps}
      user={{
        data: {
          name: "Example User",
        },
        logoutUrl: "/",
      }}
    >
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
          <form action="" method="post" className="mt-2">
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

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  const mainLayoutProps = getMainLayoutProps({
    options: pageOptions,
    isAppDir: false,
  });

  if (req.method === "POST") {
    const firstUser = await prisma.user.findFirst();
    const post = await prisma.post.create({
      data: {
        title: "Random Post",
        author: {
          connect: {
            id: firstUser?.id,
          },
        },
      },
    });

    const searchParams = new URLSearchParams();

    searchParams.set(
      "message",
      JSON.stringify({
        type: "success",
        content: "Random post created",
      })
    );

    return {
      redirect: {
        destination: `/pagerouter/admin/post/${
          post.id
        }?${searchParams.toString()}`,
        statusCode: 303,
      },
    };
  }

  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  const totalCategories = await prisma.category.count();

  return {
    props: {
      ...mainLayoutProps,
      totalUsers,
      totalPosts,
      totalCategories,
    },
  };
};
