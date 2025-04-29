import { getNextAdminProps } from "@premieroctet/next-admin/pageRouter";
import { createServerFn } from "@tanstack/react-start";
import prisma from "database";
import en from "examples-common/messages/en";
import { options } from "../options";

export const getNextAdminPropsFn = createServerFn()
  .validator((data) => {
    return {
      url: data.url as string,
      splat: data.splat as string,
    };
  })
  // @ts-expect-error
  .handler(async ({ data }) => {
    return getNextAdminProps({
      apiBasePath: "/api/admin",
      basePath: "/admin",
      prisma: prisma,
      options: options,
      url: data.url,
      getMessages: async () => en.admin as unknown as Record<string, string>,
    });
  });
