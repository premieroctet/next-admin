import { options } from "@/pageRouterOptions";
import { prisma } from "@/prisma";
import { createHandler } from "@premieroctet/next-admin/pageHandler";

export const config = {
  api: {
    bodyParser: false,
  },
};

const { run } = createHandler({
  apiBasePath: "/api/pagerouter/admin",
  options,
  prisma,
});

export default run;
