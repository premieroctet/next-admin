import { options } from "@/pageRouterOptions";
import { prisma } from "@/prisma";
import { createApiRouter } from "@premieroctet/next-admin/dist/apiRoute";
import schema from "@/prisma/json-schema/json-schema.json";

export const config = {
  api: {
    bodyParser: false,
  },
};

const { run } = createApiRouter({
  options,
  prisma,
  schema: schema,
});

export default run;
