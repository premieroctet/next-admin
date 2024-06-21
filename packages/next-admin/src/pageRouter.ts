import { IncomingMessage } from "node:http";
import { GetPropsFromParamsParams } from "./types";
import { getPropsFromParams } from "./utils/props";
import { formatSearchFields, getParamsFromUrl } from "./utils/server";

// Router
export const getNextAdminProps = async ({
  prisma,
  schema,
  basePath,
  apiBasePath,
  options,
  req,
}: Omit<GetPropsFromParamsParams, "params" | "searchParams" | "isAppDir"> & {
  req: IncomingMessage;
}) => {
  const params = getParamsFromUrl(req.url!, basePath);
  const requestOptions = formatSearchFields(req.url!);

  const props = await getPropsFromParams({
    options,
    prisma,
    schema,
    basePath,
    apiBasePath,
    searchParams: requestOptions,
    params,
    isAppDir: false,
  });

  return { props };
};

