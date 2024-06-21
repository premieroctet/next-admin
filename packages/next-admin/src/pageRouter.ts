import { PrismaClient } from "@prisma/client";
import { IncomingMessage } from "node:http";
import { NextAdminOptions } from "./types";
import { getPropsFromParams } from "./utils/props";
import { formatSearchFields, getParamsFromUrl } from "./utils/server";

// Router
export const getNextAdminProps = async (
  prisma: PrismaClient,
  schema: any,
  options: NextAdminOptions,
  req: IncomingMessage
) => {
  const params = getParamsFromUrl(req.url!, options.basePath);
  const requestOptions = formatSearchFields(req.url!);

  const props = await getPropsFromParams({
    options,
    prisma,
    schema,
    searchParams: requestOptions,
    params,
    isAppDir: false,
  });

  return { props };
};
