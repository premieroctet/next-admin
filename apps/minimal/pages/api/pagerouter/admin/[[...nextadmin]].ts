import { options } from "@/pageRouterOptions";
import { prisma } from "@/prisma";
import schema from "@/prisma/json-schema/json-schema.json";
import { createHandler } from "@premieroctet/next-admin/dist/handler";

export const config = {
  api: {
    bodyParser: false,
  },
};

const { run } = createHandler({
  apiBasePath: "/api/admin",
  options,
  prisma,
  schema,
});

export default run;
