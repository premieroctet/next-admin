import { Prisma } from "@prisma/client";
import { cloneDeep } from "lodash";
import {
  AdminComponentProps,
  EditOptions,
  Field,
  GetMainLayoutPropsParams,
  GetPropsFromParamsParams,
  ListOptions,
  MainLayoutProps,
  ModelIcon,
  ModelName,
  NextAdminOptions,
} from "../types";
import { getCustomInputs } from "./options";
import {
  getMappedDataList,
  mapDataList,
  selectPayloadForModel,
} from "./prisma";
import {
  getModelIdProperty,
  getPrismaModelForResource,
  getResourceFromParams,
  getResourceIdFromParam,
  getResources,
  getToStringForModel,
  transformData,
  transformSchema,
} from "./server";
import { extractSerializable } from "./tools";

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
  isAppDir = true,
  locale,
  getMessages,
  basePath,
  apiBasePath,
}: GetPropsFromParamsParams): Promise<
  | AdminComponentProps
  | Omit<AdminComponentProps, "dmmfSchema" | "schema" | "resource" | "action">
  | Pick<
      AdminComponentProps,
      | "pageComponent"
      | "basePath"
      | "apiBasePath"
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
    customPages,
    title,
    sidebar,
    resourcesIcons,
    externalLinks,
  } = getMainLayoutProps({ basePath, apiBasePath, options, params, isAppDir });

  const resourcesIdProperty = resources!.reduce(
    (acc, resource) => {
      acc[resource] = getModelIdProperty(resource);
      return acc;
    },
    {} as Record<ModelName, string>
  );

  const clientOptions: NextAdminOptions | undefined =
    extractSerializable(options);
  let defaultProps: AdminComponentProps = {
    resources,
    basePath,
    apiBasePath,
    isAppDir,
    customPages,
    resourcesTitles,
    resourcesIdProperty,
    options: clientOptions,
    title,
    sidebar,
    resourcesIcons,
    externalLinks,
    locale,
  };

  if (!params) return defaultProps;

  if (!resource) return defaultProps;

  // We don't need to pass the action function to the component
  const actions = options?.model?.[resource]?.actions?.map((action) => {
    const { action: _, ...actionRest } = action;
    return actionRest;
  });

  if (getMessages) {
    const messages = await getMessages(locale!);
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
      const { data, total, error } = await getMappedDataList({
        prisma,
        resource,
        options,
        searchParams: new URLSearchParams(
          searchParams as Record<string, string>
        ),
        context: { locale },
        appDir: isAppDir,
      });

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
        options
      )(cloneDeep(schema));
      const customInputs = isAppDir
        ? getCustomInputs(resource, options)
        : undefined;

      if (resourceId !== undefined) {
        const select = selectPayloadForModel(resource, edit, "object");

        Object.entries(select).forEach(([key, value]) => {
          const fieldTypeDmmf = dmmfSchema?.fields.find(
            (field) => field.name === key
          )?.type;

          if (fieldTypeDmmf && dmmfSchema) {
            const relatedResourceOptions =
              options?.model?.[fieldTypeDmmf as ModelName]?.list;

            if (
              // @ts-expect-error
              edit?.fields?.[key as Field<ModelName>]?.display === "table"
            ) {
              if (!relatedResourceOptions?.display) {
                throw new Error(
                  `'table' display mode set for field '${key}', but no list display is setup for model ${fieldTypeDmmf}`
                );
              }

              select[key] = {
                select: selectPayloadForModel(
                  fieldTypeDmmf as ModelName,
                  relatedResourceOptions as ListOptions<ModelName>,
                  "object"
                ),
              };
            }
          }
        });

        // @ts-expect-error
        let data = await prisma[resource].findUniqueOrThrow({
          select,
          where: { [idProperty]: resourceId },
        });

        Object.entries(data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            const fieldTypeDmmf = dmmfSchema?.fields.find(
              (field) => field.name === key
            )?.type;

            if (fieldTypeDmmf && dmmfSchema) {
              if (
                // @ts-expect-error
                edit?.fields?.[key as Field<ModelName>]?.display === "table"
              ) {
                data[key] = mapDataList({
                  context: { locale },
                  appDir: isAppDir,
                  fetchData: value,
                  options,
                  resource: fieldTypeDmmf as ModelName,
                });
              }
            }
          }
        });

        const toStringFunction = getToStringForModel(
          options?.model?.[resource]
        );
        const slug = toStringFunction
          ? toStringFunction(data)
          : resourceId.toString();
        data = transformData(data, resource, edit, options);
        return {
          ...defaultProps,
          resource,
          data,
          slug,
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

export const getMainLayoutProps = ({
  basePath,
  apiBasePath,
  options,
  params,
  isAppDir = false,
}: GetMainLayoutPropsParams): MainLayoutProps => {
  const resources = getResources(options);
  const resource = getResourceFromParams(params ?? [], resources);

  const customPages = Object.keys(options?.pages ?? {}).map((path) => ({
    title: options?.pages![path as keyof typeof options.pages].title ?? path,
    path: path,
    icon: options?.pages![path as keyof typeof options.pages].icon,
  }));

  const resourcesTitles = resources.reduce(
    (acc, resource) => {
      acc[resource as Prisma.ModelName] =
        options?.model?.[resource as keyof typeof options.model]?.title ??
        resource;
      return acc;
    },
    {} as { [key in Prisma.ModelName]: string }
  );

  const resourcesIcons = resources.reduce(
    (acc, resource) => {
      if (!options?.model?.[resource as keyof typeof options.model]?.icon)
        return acc;
      acc[resource as Prisma.ModelName] =
        options.model?.[resource as keyof typeof options.model]?.icon!;
      return acc;
    },
    {} as { [key in Prisma.ModelName]: ModelIcon }
  );

  return {
    resources,
    resource,
    basePath,
    apiBasePath,
    customPages,
    resourcesTitles,
    isAppDir,
    title: options?.title ?? "Admin",
    sidebar: options?.sidebar,
    resourcesIcons,
    externalLinks: options?.externalLinks,
    options: extractSerializable(options),
  };
};
