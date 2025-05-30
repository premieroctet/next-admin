"use server";
import prisma from "database";

const addTag = async (tag: string, selectedIds?: number[]) => {
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
};

export default addTag;
