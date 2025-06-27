import { options } from "@/options";
import { prisma } from "@/prisma";
import { createHandler } from "@premieroctet/next-admin/pageHandler";
import { PrismaClient } from "database";

export const config = {
  api: {
    bodyParser: false,
  },
};

const { run } = createHandler<"nextadmin", PrismaClient>({
  apiBasePath: "/api/pagerouter/admin",
  options,
  prisma,
});

export default run;
