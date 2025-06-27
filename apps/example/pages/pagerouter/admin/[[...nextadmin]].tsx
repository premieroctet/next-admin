import { AdminComponentProps } from "@premieroctet/next-admin";
import { NextAdmin } from "@premieroctet/next-admin/adapters/next";
import PageLoader from "@premieroctet/next-admin/pageLoader";
import { getNextAdminProps } from "@premieroctet/next-admin/pageRouter";
import type { PrismaClient } from "database";
import en from "examples-common/messages/en";
import { GetServerSideProps } from "next";
import { options as appOptions } from "../../../options";
import { options } from "../../../pageRouterOptions";
import { prisma } from "../../../prisma";
import "../../../styles.css";

const pageOptions = options;

export default function Admin(props: AdminComponentProps) {
  return (
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
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) =>
  // @ts-ignore
  await getNextAdminProps<PrismaClient>({
    basePath: "/pagerouter/admin",
    apiBasePath: "/api/pagerouter/admin",
    // @ts-ignore
    prisma,
    options: appOptions,
    url: req.url!,
    getMessages: async () => en.admin as unknown as Record<string, string>,
  });
