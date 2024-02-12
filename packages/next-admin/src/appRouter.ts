"use server";
import {
  GetPropsFromParamsParams,
  getPropsFromParams as _getPropsFromParams,
} from "./utils/props";

export const getPropsFromParams = (
  params: Omit<GetPropsFromParamsParams, "isAppDir">
) => _getPropsFromParams({ ...params, isAppDir: true });
