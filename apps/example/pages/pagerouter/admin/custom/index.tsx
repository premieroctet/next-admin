import { MainLayout, MainLayoutProps } from "@premieroctet/next-admin";
import { getMainLayoutProps } from "@premieroctet/next-admin/pageRouter";
import { GetServerSideProps } from "next";
import { options } from "../../../../options";
import { prisma } from "../../../../prisma";
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
        <h1 className="mb-4 text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
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

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  const mainLayoutProps = getMainLayoutProps({
    basePath: "/pagerouter/admin",
    apiBasePath: "/api/pagerouter/admin",
    options: pageOptions,
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
