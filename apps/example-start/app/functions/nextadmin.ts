import { createServerFn } from "@tanstack/react-start";
import prisma from "database";
import { options } from "../options";
import { getNextAdminProps } from "@premieroctet/next-admin/pageRouter";

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
    });
  });
