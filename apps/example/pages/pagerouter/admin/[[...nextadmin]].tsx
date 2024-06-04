import { AdminComponentProps, NextAdmin } from "@premieroctet/next-admin";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import { options } from "../../../pageRouterOptions";
import { prisma } from "../../../prisma";
import schema from "../../../prisma/json-schema/json-schema.json";
import "../../../styles.css";
import type { AppProps } from 'next/app'

const pageOptions = options;

export default function Admin(props: AppProps) {
  console.log("HERE")
  props.pageProps.params = props.router.query.nextadmin as string[];
  return (
    <NextAdmin
      {...props}
      options={pageOptions}
      user={{
        data: {
          name: "John Doe",
        },
        logoutUrl: "/",
      }}
    />
  );
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
