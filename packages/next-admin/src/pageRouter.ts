import { GetMainLayoutPropsParams, GetNextAdminPropsParams } from "./types";
import type { PrismaClient } from "./types-prisma";
import {
  getMainLayoutProps as _getMainLayoutProps,
  getPropsFromParams,
} from "./utils/props";
import { formatSearchFields, getParamsFromUrl } from "./utils/server";

// Router
export const getNextAdminProps = async <
  Client extends PrismaClient = PrismaClient,
>({
  prisma,
  basePath,
  apiBasePath,
  options,
  url,
  locale,
  getMessages,
}: Omit<
  GetNextAdminPropsParams<Client>,
  "params" | "searchParams" | "isAppDir"
> & {
  url: string;
}) => {
  const urlObj =
    url.startsWith("http://") || url.startsWith("https://")
      ? new URL(url)
      : null;
  const urlWithoutOrigin = urlObj
    ? urlObj.href.replace(urlObj.origin, "")
    : url;
  const params = getParamsFromUrl(urlWithoutOrigin, basePath);
  const requestOptions = formatSearchFields(urlWithoutOrigin);

  const props = await getPropsFromParams({
    options,
    prisma,
    basePath,
    apiBasePath,
    searchParams: requestOptions,
    params,
    isAppDir: false,
    locale,
    getMessages,
  });

  return { props };
};

export const getMainLayoutProps = (
  args: Omit<GetMainLayoutPropsParams, "isAppDir" | "params">
) => _getMainLayoutProps({ ...args, isAppDir: false });
