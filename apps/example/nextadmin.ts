import { getNextAdmin } from "@premieroctet/next-admin";
import { getMessages, getTranslations } from "next-intl/server";
import { options } from "./options";
import { prisma } from "./prisma";
import schema from "./prisma/json-schema/json-schema.json";

export default getNextAdmin({
  basePath: "/admin",
  apiBasePath: "/api/admin",
  prisma,
  options,
  schema,
  translations: await getMessages(), 
});