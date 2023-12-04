"use server";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  ActionParams,
  AdminComponentProps,
  EditOptions,
  ModelName,
  NextAdminOptions,
  Select,
  SubmitFormResult,
} from "../types";
import {
  fillRelationInSchema,
  getModelIdProperty,
  getResourceFromParams,
  getResourceIdFromParam,
  getResources,
  transformData,
  transformSchema,
  getPrismaModelForResource,
} from "./server";
import { getMappedDataList } from "./prisma";
import qs from "querystring";
import { createBoundServerAction } from "./actions";
import { getCustomInputs } from "./options";

export type GetPropsFromParamsParams = {
  params?: string[];
  searchParams: { [key: string]: string | string[] | undefined } | undefined;
  options: NextAdminOptions;
  schema: any;
  prisma: PrismaClient;
  action?: (
    params: ActionParams,
    formData: FormData
  ) => Promise<SubmitFormResult | undefined>;
  isAppDir?: boolean;
  locale?: string;
};

export async function getPropsFromParams({
  params,
  searchParams,
  options,
  schema,
  prisma,
  action,
  isAppDir = false,
  locale,
}: GetPropsFromParamsParams): Promise<
  | AdminComponentProps
  | Omit<AdminComponentProps, "dmmfSchema" | "schema" | "resource" | "action">
  | Pick<
      AdminComponentProps,
      | "pageComponent"
      | "basePath"
      | "isAppDir"
      | "message"
      | "resources"
      | "error"
    >
> {
  const pathFromParams = "/" + params?.join("/");

  const resources = getResources(options);

  let message = undefined;

  try {
    message = searchParams?.message
      ? JSON.parse(searchParams.message as string)
      : null;
  } catch {}

  const resourcesTitles = resources.reduce((acc, resource) => {
    acc[resource as Prisma.ModelName] =
      options.model?.[resource as keyof typeof options.model]?.title ??
      resource;
    return acc;
  }, {} as { [key in Prisma.ModelName]: string });
  const resourcesIdProperty = resources.reduce((acc, resource) => {
    acc[resource] = getModelIdProperty(resource);
    return acc;
  }, {} as Record<ModelName, string>);

  const customPages = Object.keys(options.pages ?? {})
    .filter((path) => {
      /**
       * Return only the pages that we want to show in the menu
       * By default, we show them
       */
      return (
        options.pages![path as keyof typeof options.pages].showInMenu ?? true
      );
    })
    .map((path) => ({
      title: options.pages![path as keyof typeof options.pages].title,
      path: path,
    }));

  if (isAppDir && options.pages?.[pathFromParams]) {
    return {
      pageComponent: options.pages[pathFromParams].component,
      basePath: options.basePath,
      isAppDir,
      resources,
      message,
      error: searchParams?.error as string,
      customPages,
      currentPath: pathFromParams,
      resourcesTitles,
      resourcesIdProperty,
    };
  }

  if (isAppDir && !action) {
    throw new Error("action is required when using App router");
  }

  const defaultProps: AdminComponentProps = {
    resources,
    basePath: options.basePath,
    isAppDir,
    action: action
      ? createBoundServerAction({ schema, params }, action)
      : undefined,
    message,
    error: searchParams?.error as string,
    customPages,
    currentPath: pathFromParams,
    resourcesTitles,
    resourcesIdProperty,
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
        { locale },
        isAppDir
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

      const idProperty = getModelIdProperty(resource);

      let selectedFields = model?.fields.reduce(
        (acc, field) => {
          acc[field.name] = true;
          return acc;
        },
        { [idProperty]: true }
      );

      const dmmfSchema = getPrismaModelForResource(resource);
      const edit = options?.model?.[resource]?.edit as EditOptions<
        typeof resource
      >;
      schema = transformSchema(schema, resource, edit);

      const customInputs = isAppDir
        ? getCustomInputs(resource, options)
        : undefined;

      if (resourceId !== undefined) {
        const editDisplayedKeys = edit && edit.display;
        const editSelect = editDisplayedKeys?.reduce(
          (acc, column) => {
            acc[column] = true;
            return acc;
          },
          { [idProperty]: true }
        );
        selectedFields = editSelect ?? selectedFields;
        // @ts-expect-error
        let data = await prisma[resource].findUniqueOrThrow({
          where: { [idProperty]: resourceId },
          select: selectedFields,
        });
        data = transformData(data, resource, edit);
        return {
          ...defaultProps,
          resource,
          data,
          schema,
          dmmfSchema: dmmfSchema?.fields,
          customInputs,
        };
      }

      if (params[1] === "new") {
        return {
          ...defaultProps,
          resource,
          schema,
          dmmfSchema: dmmfSchema?.fields,
          customInputs,
        };
      }
    }
    default:
      return defaultProps;
  }
}
