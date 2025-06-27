import { options } from "@/options";
import { prisma } from "@/prisma";
import { createHandler } from "@premieroctet/next-admin/appHandler";
import { PrismaClient } from "database";

const { run } = createHandler<"nextadmin", PrismaClient>({
  apiBasePath: "/api/admin",
  options,
  prisma,
});

export { run as DELETE, run as GET, run as POST };
