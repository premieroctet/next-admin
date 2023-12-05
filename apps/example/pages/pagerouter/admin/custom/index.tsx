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
    <MainLayout {...mainLayoutProps}>
      <div>
        <p className="text-xl font-medium">This is a custom page</p>
        <p className="text-md">Total Users: {totalUsers}</p>
        <p className="text-md">Total Posts: {totalPosts}</p>
        <p className="text-md">Total Categories: {totalCategories}</p>
      </div>
    </MainLayout>
  );
};

export default CustomPage;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const mainLayoutProps = getMainLayoutProps({
    options: pageOptions,
    isAppDir: false,
  });

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
