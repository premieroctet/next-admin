import { createOptions } from "examples-common/options";

export const options = createOptions({
  getCategories: async () => {
    const { prisma } = await import("./prisma");

    return prisma.category.findMany({
      select: { id: true, name: true },
      take: 5,
    });
  },
  publishPosts: async (ids) => {
    const { prisma } = await import("./prisma");

    await prisma.post.updateMany({
      where: { id: { in: ids.map((id) => Number(id)) } },
      data: { published: true },
    });
  },
});
