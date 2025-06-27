import { options } from "@/options";
import { prisma } from "@/prisma";
import { createHandler } from "@premieroctet/next-admin/pageHandler";
import { PrismaClient } from "database";

export const config = {
  api: {
    bodyParser: false,
  },
};

// @ts-ignore
const { run } = createHandler<"nextadmin", PrismaClient>({
  apiBasePath: "/api/pagerouter/admin",
  options,
  // @ts-ignore
  prisma,
});

export default run;
