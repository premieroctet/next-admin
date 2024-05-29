import { createAppHandler } from "@premieroctet/next-admin/dist/handler";
import schema from "@/prisma/json-schema/json-schema.json";
import { prisma } from "@/prisma";
import { options } from "@/options";

const { run } = createAppHandler({
  options,
  prisma,
  schema,
});

export { run as POST, run as GET, run as DELETE };
