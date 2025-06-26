import { GetMainLayoutPropsParams, GetNextAdminPropsParams } from "./types";
import {
  getMainLayoutProps as _getMainLayoutProps,
  getPropsFromParams as _getPropsFromParams,
} from "./utils/props";
import type { PrismaClient } from "./types-prisma";

export const getNextAdminProps = async <
  Client extends PrismaClient = PrismaClient,
>(
  params: Omit<GetNextAdminPropsParams<Client>, "schema" | "isAppDir">
) => {
  return _getPropsFromParams<Client>({ ...params, isAppDir: true });
};

export const getMainLayoutProps = (
  args: Omit<GetMainLayoutPropsParams, "isAppDir" | "params">
) => _getMainLayoutProps({ ...args, isAppDir: true });
