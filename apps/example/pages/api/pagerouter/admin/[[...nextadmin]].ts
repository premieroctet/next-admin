import { options } from "@/pageRouterOptions";
import { prisma } from "@/prisma";
import schema from "@/prisma/json-schema/json-schema.json";
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
  schema: schema,
});

export default run;
