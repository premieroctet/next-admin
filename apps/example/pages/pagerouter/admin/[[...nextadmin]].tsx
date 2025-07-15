import type {
  AdminComponentProps,
  PrismaClient,
} from "@premieroctet/next-admin";
import { NextAdmin } from "@premieroctet/next-admin/adapters/next";
import PageLoader from "@premieroctet/next-admin/pageLoader";
import { getNextAdminProps } from "@premieroctet/next-admin/pageRouter";
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
  await getNextAdminProps({
    basePath: "/pagerouter/admin",
    apiBasePath: "/api/pagerouter/admin",
    prisma: prisma as PrismaClient,
    options: appOptions,
    url: req.url!,
    getMessages: async () => en.admin as unknown as Record<string, string>,
  });
