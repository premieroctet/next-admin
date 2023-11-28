import { AdminComponentProps, NextAdmin } from "@premieroctet/next-admin";
import "@premieroctet/next-admin/dist/styles.css";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import Dashboard from "../../components/Dashboard";
import { options } from "../../options";
import { prisma } from "../../prisma";
import schema from "../../prisma/json-schema/json-schema.json";

const pageOptions = {
  ...options,
  basePath: "/legacy/admin",
};

export default function Admin(props: AdminComponentProps) {
  return <NextAdmin {...props} dashboard={Dashboard} options={pageOptions} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { nextAdminRouter } = await import(
    "@premieroctet/next-admin/dist/router"
  );

  const adminRouter = await nextAdminRouter(prisma, schema, pageOptions);
  return adminRouter.run(req, res) as Promise<
    GetServerSidePropsResult<{ [key: string]: any }>
  >;
};
