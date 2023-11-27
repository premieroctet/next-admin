"use server";
import { PrismaClient } from "@prisma/client";
import { AdminComponentProps, NextAdminOptions, Select } from "./types";
import {
  fillRelationInSchema,
  getResourceFromParams,
  getResources,
} from "./utils/server";
import { getMappedDataList } from "./utils/prisma";
import qs from "querystring";

export type GetPropsFromParamsParams = {
  params?: string[];
  searchParams: { [key: string]: string | string[] | undefined } | undefined;
  options: NextAdminOptions;
  schema: any;
  prisma: PrismaClient;
};

export async function getPropsFromParams({
  params,
  searchParams,
  options,
  schema,
  prisma,
}: GetPropsFromParamsParams): Promise<
  | AdminComponentProps
  | Omit<AdminComponentProps, "dmmfSchema" | "schema" | "resource">
> {
  const resources = getResources(options);
  const defaultProps = {
    resources,
    basePath: options.basePath,
    isAppDir: true,
  };

  if (!params) return defaultProps;

  switch (params.length) {
    case 1: {
      const resource = getResourceFromParams(params, resources);

      if (!resource) return defaultProps;

      schema = await fillRelationInSchema(
        schema,
        prisma,
        resource,
        searchParams,
        options
      );

      const { data, total, error } = await getMappedDataList(
        prisma,
        resource,
        options,
        new URLSearchParams(qs.stringify(searchParams))
      );

      return {
        ...defaultProps,
        resource,
        data,
        total,
        error,
        schema,
      };
    }
    default:
      return defaultProps;
  }
}
