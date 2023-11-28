"use server";
import { PrismaClient } from "@prisma/client";
import {
  ActionParams,
  AdminComponentProps,
  EditOptions,
  NextAdminOptions,
  Select,
  SubmitFormResult,
} from "./types";
import {
  fillRelationInSchema,
  getPrismaModelForResource,
  getResourceFromParams,
  getResourceIdFromParam,
  getResources,
  transformData,
  transformSchema,
} from "./utils/server";
import { getMappedDataList } from "./utils/prisma";
import qs from "querystring";
import { createBoundServerAction } from "./utils/actions";

export type GetPropsFromParamsParams = {
  params?: string[];
  searchParams: { [key: string]: string | string[] | undefined } | undefined;
  options: NextAdminOptions;
  schema: any;
  prisma: PrismaClient;
  action: (
    params: ActionParams,
    formData: FormData
  ) => Promise<SubmitFormResult | undefined>;
};

export async function getPropsFromParams({
  params,
  searchParams,
  options,
  schema,
  prisma,
  action,
}: GetPropsFromParamsParams): Promise<
  | AdminComponentProps
  | Omit<AdminComponentProps, "dmmfSchema" | "schema" | "resource" | "action">
> {
  const resources = getResources(options);

  let message = undefined;

  try {
    message = searchParams?.message
      ? JSON.parse(searchParams.message as string)
      : null;
  } catch {}

  const defaultProps = {
    resources,
    basePath: options.basePath,
    isAppDir: true,
    action: createBoundServerAction({ schema, params }, action),
    message,
    error: searchParams?.error as string,
  };

  if (!params) return defaultProps;

  const resource = getResourceFromParams(params, resources);

  if (!resource) return defaultProps;

  switch (params.length) {
    case 1: {
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
        new URLSearchParams(qs.stringify(searchParams)),
        true
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
    case 2: {
      const resourceId = getResourceIdFromParam(params[1], resource);
      const model = getPrismaModelForResource(resource);

      let selectedFields = model?.fields.reduce(
        (acc, field) => {
          // @ts-expect-error
          acc[field.name] = true;
          return acc;
        },
        { id: true } as Select<typeof resource>
      );

      const dmmfSchema = getPrismaModelForResource(resource);
      if (resourceId !== undefined) {
        const edit = options?.model?.[resource]?.edit as EditOptions<
          typeof resource
        >;
        const editDisplayedKeys = edit && edit.display;
        const editSelect = editDisplayedKeys?.reduce(
          (acc, column) => {
            acc[column] = true;
            return acc;
          },
          { id: true } as Select<typeof resource>
        );
        selectedFields = editSelect ?? selectedFields;
        // @ts-expect-error
        let data = await prisma[resource].findUniqueOrThrow({
          where: { id: resourceId },
          select: selectedFields,
        });
        schema = transformSchema(schema, resource, edit);
        data = transformData(data, resource, edit);
        return {
          ...defaultProps,
          resource,
          data,
          schema,
          dmmfSchema: dmmfSchema?.fields,
        };
      }

      if (params[1] === "new") {
        return {
          ...defaultProps,
          resource,
          schema,
          dmmfSchema: dmmfSchema?.fields,
        };
      }
    }
    default:
      return defaultProps;
  }
}
