import { getNextAdmin } from "@premieroctet/next-admin";
import { options } from "./options";
import { prisma } from "./prisma";
import schema from "./prisma/json-schema/json-schema.json";

export default getNextAdmin({
  basePath: "/admin",
  apiBasePath: "/api/admin",
  prisma,
  options,
  schema,
});
