import { options } from "@/options";
import { prisma } from "@/prisma";
import { createHandler } from "@premieroctet/next-admin/pageHandler";

export const config = {
  api: {
    bodyParser: false,
  },
};

const { run } = createHandler<"nextadmin">({
  apiBasePath: "/api/pagerouter/admin",
  options,
  prisma,
});

export default run;
