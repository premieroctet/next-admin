import { options } from "@/options";
import { prisma } from "@/prisma";
import schema from "@/prisma/json-schema/json-schema.json";
import { createHandler } from "@premieroctet/next-admin/dist/appHandler";

const { run } = createHandler({
  options,
  prisma,
  schema,
});

export { run as DELETE, run as GET, run as POST };