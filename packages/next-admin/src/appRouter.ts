import { GetPropsFromParamsParams } from "./types";
import { getPropsFromParams as _getPropsFromParams } from "./utils/props";

export const getNextAdminProps = async (params: GetPropsFromParamsParams) => {
  "use server";
  return _getPropsFromParams({ ...params, isAppDir: true });
};

export { getMainLayoutProps } from "./utils/props";
