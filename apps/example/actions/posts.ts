"use server";

import { redirect } from "next/navigation";
import { prisma } from "../prisma";

export const createRandomPost = async () => {
  const firstUser = await prisma.user.findFirst();
  const post = await prisma.post.create({
    data: {
      title: "Random Post",
      author: {
        connect: {
          id: firstUser?.id,
        },
      },
    },
  });

  redirect(`/admin/post/${post.id}`);
};
