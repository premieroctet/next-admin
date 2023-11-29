"use server";
import { headers } from "next/headers";
import {
  GetPropsFromParamsParams,
  getPropsFromParams as _getPropsFromParams,
} from "./utils/props";

export const getPropsFromParams = (
  params: Omit<GetPropsFromParamsParams, "isAppDir" | "locale">
) => {
  const headersList = headers();

  const locale = headersList.get("accept-language")?.split(",")[0];

  return _getPropsFromParams({ ...params, isAppDir: true, locale });
};
