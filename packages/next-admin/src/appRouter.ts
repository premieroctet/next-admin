"use server";
import { GetPropsFromParamsParams } from "./types";
import {
  getPropsFromParams as _getPropsFromParams,
} from "./utils/props";

export const getPropsFromParams = (
  params: Omit<GetPropsFromParamsParams, "isAppDir">
) => _getPropsFromParams({ ...params, isAppDir: true });
