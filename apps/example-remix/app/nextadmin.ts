export const getCategories = async () => {
  const prisma = (await import("./prisma")).default;

  return prisma.category.findMany({
    select: { id: true, name: true },
    take: 5,
  });
};

export const publishPosts = async (ids: number[] | string[]) => {
  const prisma = (await import("./prisma")).default;

  await prisma.post.updateMany({
    where: { id: { in: ids.map((id) => Number(id)) } },
    data: { published: true },
  });
};
