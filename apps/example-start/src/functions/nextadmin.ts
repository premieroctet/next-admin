import type { PrismaClient } from "@premieroctet/next-admin";
import {
  getMainLayoutProps,
  getNextAdminProps,
} from "@premieroctet/next-admin/pageRouter";
import { createServerFn, json } from "@tanstack/react-start";
import en from "examples-common/messages/en";
import { options } from "../options";
import prisma from "../prisma";

export const getNextAdminPropsFn = createServerFn()
  .inputValidator((data: Record<string, string>) => {
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
      prisma: prisma as PrismaClient,
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

export const getCategories = createServerFn().handler(async () => {
  return prisma.category.findMany({
    select: { id: true, name: true },
    take: 5,
  });
});

export const publishPosts = createServerFn()
  .inputValidator((data) => {
    if (!data) {
      throw json({ error: "Missing data" }, { status: 422 });
    }

    return data as number[] | string[];
  })
  .handler(async ({ data }) => {
    await prisma.post.updateMany({
      where: { id: { in: data.map((id) => Number(id)) } },
      data: { published: true },
    });
  });

export const addTag = createServerFn()
  .inputValidator((data) => {
    if (!data) {
      throw json({ error: "Missing data" }, { status: 422 });
    }

    return data as { tag: string; selectedIds?: number[] };
  })
  .handler(async ({ data }) => {
    const { tag, selectedIds } = data;

    await prisma.post.updateMany({
      where: {
        id: {
          in: selectedIds,
        },
      },
      data: {
        tags: {
          push: tag,
        },
      },
    });
  });
