import { Prisma } from "@prisma/client";
import cloneDeep from "lodash.clonedeep";
import {
  AdminComponentProps,
  EditOptions,
  FilterWrapper,
  GetMainLayoutPropsParams,
  GetNextAdminPropsParams,
  MainLayoutProps,
  ModelAction,
  ModelIcon,
  ModelName,
  NextAdminOptions,
  PageRouterComponentProps,
} from "../types";
import { getClientActionsComponents, getCustomInputs } from "./options";
import { getDataItem, getMappedDataList, mapModelFilters } from "./prisma";
import {
  applyVisiblePropertiesInSchema,
  getEnableToExecuteActions,
  getModelIdProperty,
  getResourceFromParams,
  getResourceIdFromParam,
  getResources,
  getToStringForModel,
  transformSchema,
} from "./server";
import { extractSerializable } from "./tools";
import { getSchema, initGlobals } from "./globals";

enum Page {
  LIST = 1,
  EDIT = 2,
}

export async function getPropsFromParams({
  params,
  searchParams,
  options,
  prisma,
  isAppDir = true,
  locale,
  getMessages,
  basePath,
  apiBasePath,
}: GetNextAdminPropsParams): Promise<PageRouterComponentProps> {
  const {
    resource,
    resources,
    resourcesTitles,
    resourcesIdProperty,
    customPages,
    title,
    sidebar,
    resourcesIcons,
    externalLinks,
  } = await getMainLayoutProps({
    basePath,
    apiBasePath,
    options,
    params,
    isAppDir,
  });

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
    locale: locale ?? null,
    schema: getSchema(),
  };

  if (!params) return defaultProps;

  if (!resource) return defaultProps;

  // We don't need to pass the action function and canExecute to the component
  const actions = options?.model?.[resource]?.actions?.map((action) => {
    // @ts-expect-error
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

  const dialogActionsComponents = isAppDir
    ? getClientActionsComponents(resource, options)
    : null;

  switch (params.length) {
    case Page.LIST: {
      const { data, total, error, rawData } = await getMappedDataList({
        prisma,
        resource,
        options,
        searchParams: new URLSearchParams(
          searchParams as Record<string, string>
        ),
        context: { locale },
        appDir: isAppDir,
      });

      if (options?.model?.[resource]?.list?.filters) {
        // @ts-expect-error
        clientOptions.model[resource].list.filters = await mapModelFilters(
          options.model![resource]!.list!.filters
        );
      }

      const dataIds = data.map(
        (item) => item[getModelIdProperty(resource)].value
      );

      const fullfilledAction = await getEnableToExecuteActions<typeof resource>(
        resource,
        prisma,
        dataIds,
        actions as ModelAction<typeof resource>[]
      );

      let serializedActions = extractSerializable(
        cloneDeep(fullfilledAction),
        isAppDir
      );

      // const verifiedAction = actions?.map((action) => {
      //   action.canExecute = action.canExecute ?? (() => true);
      // });

      return {
        ...defaultProps,
        resource,
        data,
        total,
        error: error ?? (searchParams?.error as string) ?? null,
        actions: serializedActions,
        dialogComponents: dialogActionsComponents,
        rawData: extractSerializable(rawData),
        listFilterOptions:
          (clientOptions?.model?.[resource]?.list
            ?.filters as FilterWrapper<ModelName>[]) ?? null,
      };
    }
    case Page.EDIT: {
      const resourceId = getResourceIdFromParam(params[1], resource);

      const edit = options?.model?.[resource]?.edit as EditOptions<
        typeof resource
      >;

      let deepCopySchema = await transformSchema(
        resource,
        edit,
        options
      )(cloneDeep(getSchema()));
      const customInputs = isAppDir ? getCustomInputs(resource, options) : null;

      if (resourceId !== undefined) {
        const { data, relationshipsRawData } = await getDataItem({
          prisma,
          resource,
          resourceId,
          options,
          locale,
          isAppDir,
        });

        const toStringFunction = getToStringForModel(
          options?.model?.[resource]
        );
        const slug = toStringFunction
          ? toStringFunction(data)
          : resourceId.toString();

        applyVisiblePropertiesInSchema(resource, edit, data, deepCopySchema);

        const dataId = data[getModelIdProperty(resource)];

        const fullfilledAction = await getEnableToExecuteActions<
          typeof resource
        >(
          resource,
          prisma,
          [dataId],
          actions as ModelAction<typeof resource>[]
        );

        let serializedActions = extractSerializable(
          cloneDeep(fullfilledAction),
          isAppDir
        );

        return {
          ...defaultProps,
          resource,
          data,
          slug,
          schema: deepCopySchema,
          customInputs,
          actions: serializedActions,
          dialogComponents: dialogActionsComponents,
          relationshipsRawData: extractSerializable(
            relationshipsRawData,
            isAppDir
          ),
        };
      }

      if (params[1] === "new") {
        return {
          ...defaultProps,
          resource,
          schema: deepCopySchema,
          customInputs,
        };
      }
      return defaultProps;
    }
    default:
      return defaultProps;
  }
}

export const getMainLayoutProps = async ({
  basePath,
  apiBasePath,
  options,
  params,
  isAppDir = true,
}: GetMainLayoutPropsParams): Promise<MainLayoutProps> => {
  if (params !== undefined && !Array.isArray(params)) {
    throw new Error(
      "`params` parameter in `getMainLayoutProps` should be an array of strings."
    );
  }

  await initGlobals();

  const resources = getResources(options);
  const resource = getResourceFromParams(params ?? [], resources);
  const resourcesIdProperty = resources!.reduce(
    (acc, resource) => {
      acc[resource] = getModelIdProperty(resource);
      return acc;
    },
    {} as Record<ModelName, string>
  );

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
    title: isAppDir ? (options?.title ?? "Admin") : null,
    sidebar: options?.sidebar,
    resourcesIcons,
    externalLinks: options?.externalLinks,
    options: extractSerializable(options, isAppDir),
    resourcesIdProperty: resourcesIdProperty,
    schema: getSchema(),
  };
};
