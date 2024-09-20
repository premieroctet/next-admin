import { GetMainLayoutPropsParams, GetNextAdminPropsParams } from "./types";
import {
  getMainLayoutProps as _getMainLayoutProps,
  getPropsFromParams as _getPropsFromParams,
} from "./utils/props";

export const getNextAdminProps = async (
  params: Omit<GetNextAdminPropsParams, "isAppDir">
) => {
  "use server";
  return _getPropsFromParams({ ...params, isAppDir: true });
};

export const getMainLayoutProps = (
  args: Omit<GetMainLayoutPropsParams, "isAppDir" | "params">
) => _getMainLayoutProps({ ...args, isAppDir: true });
