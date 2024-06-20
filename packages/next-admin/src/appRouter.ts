"use server";
import { GetPropsFromParamsParams } from "./types";
import { getPropsFromParams as _getPropsFromParams } from "./utils/props";

export const getNextAdminProps = ({
  isAppDir = true,
  ...params
}: GetPropsFromParamsParams) => _getPropsFromParams({ ...params, isAppDir });
