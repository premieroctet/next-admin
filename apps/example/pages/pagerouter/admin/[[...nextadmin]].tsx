import { AdminComponentProps, NextAdmin } from "@premieroctet/next-admin";
import { NextAdminRouterAdapter } from "@premieroctet/next-admin/adapters/next";
import PageLoader from "@premieroctet/next-admin/pageLoader";
import { getNextAdminProps } from "@premieroctet/next-admin/pageRouter";
import { GetServerSideProps } from "next";
import { options } from "../../../pageRouterOptions";
import { prisma } from "../../../prisma";
import "../../../styles.css";

const pageOptions = options;

export default function Admin(props: AdminComponentProps) {
  return (
    <NextAdminRouterAdapter>
      <NextAdmin
        {...props}
        options={pageOptions}
        user={{
          data: {
            name: "John Doe",
          },
          logout: ["/"],
        }}
        pageLoader={<PageLoader />}
      />
    </NextAdminRouterAdapter>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) =>
  await getNextAdminProps({
    basePath: "/pagerouter/admin",
    apiBasePath: "/api/pagerouter/admin",
    prisma,
    options: pageOptions,
    req,
  });
