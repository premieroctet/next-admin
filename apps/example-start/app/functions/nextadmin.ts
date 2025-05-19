import {
  getMainLayoutProps,
  getNextAdminProps,
} from "@premieroctet/next-admin/pageRouter";
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

export const getNextAdminCustomPageFn = createServerFn()
  // @ts-expect-error
  .handler(async () => {
    const mainLayoutProps = await getMainLayoutProps({
      basePath: "/admin",
      apiBasePath: "/api/admin",
      options,
    });

    const totalUsers = await prisma.user.count();
    const totalPosts = await prisma.post.count();
    const totalCategories = await prisma.category.count();

    return {
      mainLayoutProps,
      totalUsers,
      totalPosts,
      totalCategories,
    };
  });
