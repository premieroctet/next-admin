import {
  AdminComponentProps,
  NextAdmin,
  NextAdminOptions,
} from "@premieroctet/next-admin";
import "@premieroctet/next-admin/dist/styles.css";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import Dashboard from "../../components/Dashboard";
import { prisma } from "../../prisma";
import schema from "../../prisma/json-schema/json-schema.json";
import { options } from "../../options";

export default function Admin(props: AdminComponentProps) {
  return <NextAdmin {...props} dashboard={Dashboard} options={options} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { nextAdminRouter } = await import(
    "@premieroctet/next-admin/dist/router"
  );

  const adminRouter = await nextAdminRouter(prisma, schema, options);
  return adminRouter.run(req, res) as Promise<
    GetServerSidePropsResult<{ [key: string]: any }>
  >;
};
