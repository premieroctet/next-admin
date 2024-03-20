import { Prisma, PrismaClient } from "@prisma/client";
import { cloneDeep } from "lodash";
import qs from "querystring";
import {
  ActionParams,
  AdminComponentProps,
  EditOptions,
  MainLayoutProps,
  ModelName,
  NextAdminOptions,
  SubmitFormResult,
} from "../types";
import { createBoundServerAction } from "./actions";
import { getCustomInputs } from "./options";
import { getMappedDataList, selectPayloadForModel } from "./prisma";
import {
  getModelIdProperty,
  getPrismaModelForResource,
  getResourceFromParams,
  getResourceIdFromParam,
  getResources,
  transformData,
  transformSchema,
} from "./server";
import { extractSerializable } from "./tools";

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
  deleteAction?: (
    resource: ModelName,
    ids: string[] | number[]
  ) => Promise<void>;
  locale?: string;
  getMessages?: () => Promise<Record<string, string>>;
};

enum Page {
  LIST = 1,
  EDIT = 2,
}

export async function getPropsFromParams({
  params,
  searchParams,
  options,
  schema,
  prisma,
  action,
  isAppDir = false,
  deleteAction,
  locale,
  getMessages,
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
  const {
    resource,
    resources,
    resourcesTitles,
    basePath,
    customPages,
    error,
    message,
    title,
    sidebar,
  } = getMainLayoutProps({ options, params, searchParams, isAppDir });

  const resourcesIdProperty = resources!.reduce(
    (acc, resource) => {
      acc[resource] = getModelIdProperty(resource);
      return acc;
    },
    {} as Record<ModelName, string>
  );

  if (isAppDir && !action) {
    throw new Error("action is required when using App router");
  }

  if (isAppDir && !deleteAction) {
    console.warn(
      "deleteAction not provided. Delete buttons will have no effect"
    );
  }

  const clientOptions: NextAdminOptions = extractSerializable(options);
  let defaultProps: AdminComponentProps = {
    resources,
    basePath,
    isAppDir,
    action: action
      ? createBoundServerAction({ schema, params }, action)
      : undefined,
    message,
    error,
    customPages,
    resourcesTitles,
    resourcesIdProperty,
    deleteAction,
    options: clientOptions,
    title,
    sidebar,
  };

  if (!params) return defaultProps;

  if (!resource) return defaultProps;

  const actions = options?.model?.[resource]?.actions;

  if (getMessages) {
    const messages = await getMessages();
    const dottedProperty = {} as any;
    const dot = (obj: object, prefix = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "object") {
          dot(value, `${prefix}${key}.`);
        } else {
          dottedProperty[`${prefix}${key}`] = value;
        }
      });
    };
    dot(messages as object);
    defaultProps = {
      ...defaultProps,
      translations: dottedProperty,
    };
  }

  switch (params.length) {
    case Page.LIST: {
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
        error: error ?? (searchParams?.error as string),
        schema,
        actions: isAppDir ? actions : undefined,
      };
    }
    case Page.EDIT: {
      const resourceId = getResourceIdFromParam(params[1], resource);
      const idProperty = getModelIdProperty(resource);

      const dmmfSchema = getPrismaModelForResource(resource);
      const edit = options?.model?.[resource]?.edit as EditOptions<
        typeof resource
      >;

      let deepCopySchema = await transformSchema(
        resource,
        edit,
        prisma,
        searchParams,
        options
      )(cloneDeep(schema));
      const customInputs = isAppDir
        ? getCustomInputs(resource, options)
        : undefined;

      if (resourceId !== undefined) {
        const select = selectPayloadForModel(resource, edit, "object");
        // @ts-expect-error
        let data = await prisma[resource].findUniqueOrThrow({
          select,
          where: { [idProperty]: resourceId },
        });
        data = transformData(data, resource, edit, options);
        return {
          ...defaultProps,
          resource,
          data,
          schema: deepCopySchema,
          dmmfSchema: dmmfSchema?.fields,
          customInputs,
          actions: isAppDir ? actions : undefined,
        };
      }

      if (params[1] === "new") {
        return {
          ...defaultProps,
          resource,
          schema: deepCopySchema,
          dmmfSchema: dmmfSchema?.fields,
          customInputs,
        };
      }
      return defaultProps;
    }
    default:
      return defaultProps;
  }
}

type GetMainLayoutPropsParams = {
  options: NextAdminOptions;
  params?: string[];
  searchParams?: { [key: string]: string | string[] | undefined };
  isAppDir?: boolean;
};

export const getMainLayoutProps = ({
  options,
  params,
  searchParams,
  isAppDir = false,
}: GetMainLayoutPropsParams): MainLayoutProps => {
  const resources = getResources(options);
  const resource = getResourceFromParams(params ?? [], resources);

  const customPages = Object.keys(options.pages ?? {}).map((path) => ({
    title: options.pages![path as keyof typeof options.pages].title,
    path: path,
  }));

  let message = undefined;

  try {
    message = searchParams?.message
      ? JSON.parse(searchParams.message as string)
      : null;
  } catch {}

  const resourcesTitles = resources.reduce(
    (acc, resource) => {
      acc[resource as Prisma.ModelName] =
        options.model?.[resource as keyof typeof options.model]?.title ??
        resource;
      return acc;
    },
    {} as { [key in Prisma.ModelName]: string }
  );

  return {
    resources,
    resource,
    basePath: options.basePath,
    customPages,
    error: searchParams?.error as string,
    message,
    resourcesTitles,
    isAppDir,
    title: options.title ?? "Admin",
    sidebar: options.sidebar,
  };
};
