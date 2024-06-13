import { options } from "./options";
import { prisma } from "./prisma";
import schema from "./prisma/json-schema/json-schema.json";
import { getNextAdmin } from "@premieroctet/next-admin";

export default getNextAdmin({
  apiBasePath: "/api/admin",
  options,
  schema,
})