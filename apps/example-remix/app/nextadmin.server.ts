import prisma from "./prisma";

export const getCategories = async () => {
  return prisma.category.findMany({
    select: { id: true, name: true },
    take: 5,
  });
};

export const publishPosts = async (ids: number[] | string[]) => {
  await prisma.post.updateMany({
    where: { id: { in: ids.map((id) => Number(id)) } },
    data: { published: true },
  });
};
