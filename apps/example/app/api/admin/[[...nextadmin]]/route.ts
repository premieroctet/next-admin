import { options } from "@/options";
import { prisma } from "@/prisma";
import type { PrismaClient } from "@premieroctet/next-admin";
import { createHandler } from "@premieroctet/next-admin/appHandler";

const { run } = createHandler<"nextadmin">({
  apiBasePath: "/api/admin",
  options,
  prisma: prisma as PrismaClient,
});

export { run as DELETE, run as GET, run as POST };
