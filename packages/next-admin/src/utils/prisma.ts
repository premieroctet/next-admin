import type { NextAdminJsonSchemaData } from "@premieroctet/next-admin-json-schema";
import cloneDeep from "lodash.clonedeep";
import { ITEMS_PER_PAGE } from "../config";
import type {
  EditOptions,
  Enumeration,
  Field,
  Filter,
  FilterWrapper,
  ListOptions,
  Model,
  ModelName,
  NextAdminContext,
  NextAdminOptions,
  NoticeField,
  Order,
  PrismaListRequest,
  SchemaDefinitions,
  SchemaProperty,
  Select,
  VirtualField,
} from "../types";
import type { PrismaClient } from "../types-prisma";
import { validateQuery } from "./advancedSearch";
import { getSchema } from "./globals";
import { getDefinitionFromRef } from "./jsonSchema";
import { Prisma } from "./prisma-runtime";
import {
  enumValueForEnumType,
  findRelationInData,
  getModelIdProperty,
  getToStringForRelations,
  modelHasIdField,
  transformData,
} from "./server";
import {
  capitalize,
  extractSerializable,
  isScalar,
  uncapitalize,
} from "./tools";

type CreateNestedWherePredicateParams<M extends ModelName> = {
  field: NextAdminJsonSchemaData & { name: string };
  options?: NextAdminOptions;
  search: string;
  searchOptions?: Field<M>[];
};

const createNestedWherePredicate = <M extends ModelName>(
  {
    field,
    options,
    search,
    searchOptions,
  }: CreateNestedWherePredicateParams<M>,
  acc: Record<string, any> = {}
) => {
  const resource = getSchema().definitions[field.type as ModelName];
  const resourceProperties = resource.properties;

  acc[field.name] = {
    OR: searchOptions
      ?.map((searchOption) => {
        const [_, subFieldName, ...rest] = searchOption.toString().split(".");
        const subField =
          resourceProperties[subFieldName as keyof typeof resourceProperties];

        if (!subField) {
          return null;
        } else if (subField.__nextadmin?.kind === "scalar") {
          if (subField.__nextadmin?.isList) {
            let searchTerm: string | number = search;

            if (
              subField.__nextadmin?.type !== "String" &&
              !isNaN(Number(search))
            ) {
              searchTerm = Number(search);
            }

            return {
              has: searchTerm,
            };
          }

          if (subField.__nextadmin?.type === "String") {
            // @ts-ignore
            const mode = Prisma?.QueryMode
              ? { mode: Prisma.QueryMode.insensitive }
              : {};
            return {
              [subFieldName]: { contains: search, ...mode },
            };
          }
          if (subField.__nextadmin?.type === "Int" && !isNaN(Number(search))) {
            return { [subFieldName]: Number(search) };
          }
        } else if (subField.__nextadmin?.kind === "object") {
          const predicate = createNestedWherePredicate({
            field: { ...subField.__nextadmin, name: subFieldName },
            options,
            search,
            searchOptions: [[subFieldName, ...rest].join(".")] as Field<M>[],
          });

          if (subField.__nextadmin?.isList) {
            predicate[subFieldName] = {
              some: predicate[subFieldName],
            };
          }

          return predicate;
        }
      })
      .filter(Boolean),
  };

  return acc;
};

type CreateWherePredicateParams<M extends ModelName> = {
  resource: M;
  options?: NextAdminOptions;
  search?: string;
  otherFilters?: Filter<M>[];
  advancedSearch?: string;
};

export const createWherePredicate = <M extends ModelName>({
  resource,
  options,
  search,
  otherFilters,
  advancedSearch,
}: CreateWherePredicateParams<M>) => {
  let fieldsFiltered = getFieldsFiltered(resource, options);

  const searchFilter = search
    ? {
        OR: fieldsFiltered
          ?.filter(([, field]) => {
            return (
              field?.__nextadmin?.kind === "scalar" ||
              field?.__nextadmin?.kind === "enum" ||
              field?.__nextadmin?.kind === "object"
            );
          })
          .map(([name, field]) => {
            const fieldNextAdmin = field?.__nextadmin;

            if (fieldNextAdmin?.kind === "object") {
              return createNestedWherePredicate({
                field: { ...fieldNextAdmin, name },
                options,
                search,
                searchOptions: (
                  options?.model?.[resource]?.list?.search as string[]
                )?.filter((searchOption) =>
                  searchOption?.toString().startsWith(name)
                ) as Field<M>[],
              });
            }

            if (fieldNextAdmin?.kind === "enum" && fieldNextAdmin?.enum) {
              const enumDefinition = getDefinitionFromRef(
                getSchema(),
                fieldNextAdmin.enum.$ref
              );
              const enumValueForSearchTerm = enumValueForEnumType(
                enumDefinition,
                search
              );

              if (enumValueForSearchTerm && enumDefinition?.enum) {
                return {
                  [name]: enumDefinition.enum.find(
                    (val) => val === enumValueForSearchTerm
                  ),
                };
              }
            }

            if (fieldNextAdmin?.kind === "scalar" && fieldNextAdmin?.isList) {
              if (
                fieldNextAdmin?.type !== "String" &&
                Number.isNaN(Number(search))
              ) {
                return null;
              }

              return {
                [name]: {
                  has:
                    fieldNextAdmin?.type === "String" ? search : Number(search),
                },
              };
            }

            if (fieldNextAdmin?.type === "String") {
              // @ts-ignore
              const mode = Prisma?.QueryMode
                ? { mode: Prisma.QueryMode.insensitive }
                : {};
              return {
                [name]: { contains: search, ...mode },
              };
            }
            if (fieldNextAdmin?.type === "Int" && !isNaN(Number(search))) {
              return { [name]: Number(search) };
            }
            return null;
          })
          .filter(Boolean),
      }
    : {};

  const externalFilters = otherFilters ?? [];

  const advancedSearchFilter = advancedSearch
    ? getWherePredicateFromQueryParams(advancedSearch)
    : null;

  return {
    AND: [...externalFilters, searchFilter, advancedSearchFilter].filter(
      Boolean
    ),
  };
};

const getFieldsFiltered = <M extends ModelName>(
  resource: M,
  options?: NextAdminOptions
): [string, SchemaProperty<M>[Field<M>]][] => {
  const model = getSchema().definitions[
    resource
  ] as SchemaDefinitions[ModelName];
  const modelProperties = model.properties;

  let fieldsFiltered = Object.entries(modelProperties).filter(
    ([, field]) => field.__nextadmin?.kind === "scalar"
  );
  const list = options?.model?.[resource]?.list as ListOptions<M>;
  if (list) {
    fieldsFiltered = list?.search
      ? Object.entries(modelProperties).filter(([name]) =>
          (list.search as string[])?.some((search) => {
            const searchNameSplit = search?.toString().split(".");

            return searchNameSplit?.[0] === name;
          })
        )
      : fieldsFiltered;
  }

  return fieldsFiltered as Array<[string, SchemaProperty<M>[Field<M>]]>;
};

const getWherePredicateFromQueryParams = (query: string) => {
  return validateQuery(query);
};

export const mapModelFilters = async (
  filters: ListOptions<ModelName>["filters"]
): Promise<FilterWrapper<ModelName>[]> => {
  if (!filters) {
    return [];
  }

  const newFilters = await Promise.all(
    filters.map(async (filter) => {
      if (typeof filter === "function") {
        const asyncFilters = await filter();

        return asyncFilters;
      }

      return filter;
    })
  );

  return newFilters.flat().filter(Boolean);
};

const preparePrismaListRequest = async <M extends ModelName>(
  resource: M,
  searchParams: any,
  options?: NextAdminOptions,
  skipFilters: boolean = false
): Promise<PrismaListRequest<M>> => {
  const idProperty = getModelIdProperty(resource);
  const model = getSchema().definitions[
    resource
  ] as SchemaDefinitions[ModelName];
  const modelProperties = model.properties;
  const search = searchParams.get("search") || "";
  const advancedSearch = searchParams.get("q") || "";
  let filtersParams: string[] = [];
  try {
    filtersParams = skipFilters
      ? []
      : (JSON.parse(searchParams.get("filters")) as string[]);
  } catch {}
  const page = Number(searchParams.get("page")) || 1;
  const itemsPerPage =
    Number(searchParams.get("itemsPerPage")) ||
    options?.model?.[resource]?.list?.defaultListSize ||
    ITEMS_PER_PAGE;

  const fieldSort = options?.model?.[resource]?.list?.defaultSort;

  const filters = await mapModelFilters(
    options?.model?.[resource]?.list?.filters
  );

  const fieldFilters = filters
    ?.filter((filter) => {
      if (Array.isArray(filtersParams)) {
        return filtersParams.includes(filter.name);
      } else {
        return filter.active;
      }
    })
    ?.map((filter) => filter.value);

  let orderBy: Order<typeof resource> | Order<typeof resource>[] = {};

  if (options?.model?.[resource]?.list?.orderField) {
    orderBy[options?.model?.[resource]?.list?.orderField] = "asc";
  } else {
    // Creates a sort object for a field
    const createSortObject = (
      field: Field<typeof resource>,
      direction: Prisma.SortOrder
    ): Record<string, any> | null => {
      const modelFieldSortParam =
        modelProperties[field as keyof typeof modelProperties];
      const modelFieldNextAdminData = modelFieldSortParam?.__nextadmin;

      if (direction in Prisma.SortOrder) {
        if (field in Prisma[`${capitalize(resource)}ScalarFieldEnum`]) {
          return { [field]: direction };
        } else if (modelFieldNextAdminData?.kind === "object") {
          if (modelFieldNextAdminData.isList) {
            return {
              [field as Field<M>]: {
                _count: direction,
              },
            };
          } else {
            const modelFieldSortProperty = (
              options?.model?.[resource]?.list?.fields as any
            )?.[field as Field<M>]?.sortBy;

            const resourceSortByField =
              modelFieldSortProperty ??
              getModelIdProperty(modelFieldNextAdminData.type as ModelName);

            return {
              [field as Field<M>]: {
                [resourceSortByField]: direction,
              },
            };
          }
        }
      }
      return null;
    };

    const sortParam = searchParams.get("sortColumn") as Field<typeof resource>;
    const sortDirection = searchParams.get("sortDirection") as Prisma.SortOrder;

    if (sortParam && sortDirection) {
      const sortObject = createSortObject(sortParam, sortDirection);
      if (sortObject) {
        orderBy = sortObject;
      }
    } else if (fieldSort) {
      if (Array.isArray(fieldSort)) {
        const sortObjects = fieldSort
          .map((sort: any) => {
            return createSortObject(sort.field, sort.direction || "asc");
          })
          .filter(Boolean) as any[];

        if (sortObjects.length > 0) {
          orderBy = sortObjects;
        }
      } else {
        const sortObject = createSortObject(
          fieldSort.field,
          fieldSort.direction || "asc"
        );
        if (sortObject) {
          orderBy = sortObject;
        }
      }
    }
  }

  let select: Select<M> | undefined;
  let where = {};
  const list = options?.model?.[resource]?.list as ListOptions<M>;
  select = selectPayloadForModel(resource, list, "object");
  where = createWherePredicate({
    resource,
    options,
    search,
    otherFilters: [...(fieldFilters ?? []), ...(list?.where ?? [])],
    advancedSearch,
  });

  if (Object.keys(orderBy).length === 0) {
    orderBy = {
      [idProperty]: "asc",
    } as Order<typeof resource>;
  }

  return {
    select,
    where,
    orderBy: orderBy as Order<M>,
    skip: (page - 1) * itemsPerPage,
    take: itemsPerPage,
  };
};

type GetMappedDataListParams = {
  prisma: PrismaClient;
  resource: ModelName;
  options?: NextAdminOptions;
  searchParams: URLSearchParams;
  context: NextAdminContext;
  appDir?: boolean;
};

type OptionsFromResourceParams = {
  originResource: ModelName;
  property: string;
} & GetMappedDataListParams;

export const optionsFromResource = async ({
  originResource,
  property,
  ...args
}: OptionsFromResourceParams) => {
  const relationshipField = (
    args.options?.model?.[originResource]?.edit?.fields as any
  )?.[property as Field<typeof originResource>]?.relationshipSearchField;

  if (relationshipField) {
    const targetModel = getSchema().definitions[args.resource];

    if (!targetModel) {
      throw new Error(`Model ${args.resource} not found in schema`);
    }

    const targetModelProperties = targetModel.properties;
    const modelField =
      targetModelProperties[
        relationshipField as keyof typeof targetModelProperties
      ];

    if (modelField && modelField.__nextadmin?.type !== "scalar") {
      args.resource = modelField.__nextadmin?.type as ModelName;
    } else {
      console.warn(
        "Used relationshipSearch on a scalar field, ignoring property"
      );
    }
  }

  const data = await fetchDataList(args, true);
  const { data: dataItems, total, error } = data;
  const { resource } = args;
  const idProperty = getModelIdProperty(resource);
  const dataTableItems = mapDataList({
    ...args,
    fetchData: cloneDeep(dataItems),
  });

  const toStringModel = getToStringForRelations(
    originResource,
    property as Field<typeof originResource>,
    args.resource,
    args.options
  );

  const displayMode =
    args.options?.model?.[originResource]?.edit?.fields?.[
      property as Field<typeof originResource>
      // @ts-expect-error
    ]?.display;

  return {
    data: dataItems.map((item): Enumeration => {
      const dataTableItem = dataTableItems.find(
        (dataTableItem) => dataTableItem[idProperty].value === item[idProperty]
      );
      return {
        label: toStringModel(item),
        value: item[idProperty],
        data: displayMode === "table" ? dataTableItem : undefined,
      };
    }),
    total,
    error,
  };
};

type FetchDataListParams = {
  prisma: PrismaClient;
  resource: ModelName;
  options?: NextAdminOptions;
  searchParams: URLSearchParams;
};

const fetchDataList = async (
  { prisma, resource, options, searchParams }: FetchDataListParams,
  skipFilters: boolean = false
) => {
  const prismaListRequest = await preparePrismaListRequest(
    resource,
    searchParams,
    options,
    skipFilters
  );
  let data: any[] = [];
  let total: number;
  let error: string | null = null;

  const { where, orderBy, skip, take, select } = prismaListRequest;
  const idProperty = getModelIdProperty(resource);

  try {
    // @ts-expect-error
    const resourceIds = await prisma[uncapitalize(resource)].findMany({
      select: {
        [idProperty]: true,
      },
      where,
      orderBy,
      skip,
      take,
    });

    // @ts-expect-error
    data = await prisma[uncapitalize(resource)].findMany({
      select,
      where: {
        [idProperty]: {
          in: resourceIds.map((item: any) => item[idProperty]),
        },
      },
      orderBy,
    });
    // @ts-expect-error
    total = await prisma[uncapitalize(resource)].count({
      where,
    });
  } catch (e: any) {
    const { skip, take, orderBy } = prismaListRequest;
    // @ts-expect-error
    data = await prisma[uncapitalize(resource)].findMany({
      skip,
      take,
      orderBy,
    });
    // @ts-expect-error
    total = await prisma[uncapitalize(resource)].count();
    error = e.message ? e.message : e;
    console.error(e);
  }
  return {
    data,
    total,
    error,
  };
};

export const mapDataList = ({
  context,
  appDir,
  fetchData,
  ...args
}: Pick<
  GetMappedDataListParams,
  "resource" | "options" | "context" | "appDir"
> & { fetchData: any[] }) => {
  const { resource, options } = args;
  const originalFetchData = cloneDeep(fetchData);
  const data = findRelationInData(fetchData, getSchema().definitions[resource]);
  const listFields = options?.model?.[resource]?.list?.fields ?? {};
  const listDisplayOptions = options?.model?.[resource]?.list?.display ?? [];
  const originalData = cloneDeep(data);
  data.forEach((item, index) => {
    context.row = originalData[index];
    if ("_count" in item && typeof item._count === "object") {
      Object.keys(item._count).forEach((key) => {
        item[key] = {
          type: "count",
          value: item._count[key],
          __nextadmin_formatted: item._count[key].toString(),
        };
      });
    }
    delete item._count;
    Object.keys(item).forEach((key) => {
      let itemValue = null;
      const model = capitalize(key) as ModelName;
      const idProperty = getModelIdProperty(model);
      if (typeof item[key] === "object" && item[key] !== null) {
        switch (item[key].type) {
          case "link":
            itemValue = item[key].value.label;
            break;
          case "count":
            itemValue = item[key].value;
            break;
          case "date":
            itemValue = item[key].value.toString();
            break;
          default:
            itemValue = item[key][idProperty];
            break;
        }

        item[key].__nextadmin_formatted = itemValue;
      } else if (isScalar(item[key]) && item[key] !== null) {
        const originalValue = item[key];
        item[key] = {
          type: "scalar",
          value: originalValue,
          __nextadmin_formatted: originalValue.toString(),
        };
        itemValue = item[key].value;
      }

      if (
        appDir &&
        key in listFields &&
        listFields[key as Field<ModelName>]?.formatter &&
        itemValue !== null
      ) {
        item[key].__nextadmin_formatted = listFields[
          key as Field<ModelName>
        ]?.formatter?.(itemValue ?? item[key], context);
      } else {
        if (typeof item[key]?.__nextadmin_formatted === "object") {
          item[key].__nextadmin_formatted =
            item[key].__nextadmin_formatted[idProperty];
        }
        data[index][key] = item[key];
      }

      if (typeof item[key]?.value === "object") {
        item[key].value.label = item[key].value.label[idProperty];
      }
    });

    listDisplayOptions.forEach((displayOpt) => {
      if (typeof displayOpt === "object") {
        const { key, formatter } = displayOpt;

        const virtualFieldCtx = {
          ...context,
          row: originalFetchData[index],
        };

        const formatted = formatter?.(virtualFieldCtx);

        item[key] = {
          type:
            typeof formatted === "string"
              ? (displayOpt.type ?? "scalar")
              : displayOpt.type,
          value:
            displayOpt.type === "link"
              ? { url: displayOpt.url(virtualFieldCtx) }
              : typeof formatted === "string"
                ? formatted
                : undefined,
          __nextadmin_formatted:
            !appDir && typeof formatted === "string" ? null : formatted,
          isOverridden: displayOpt.type === "link" ? true : null,
        };
      }
    });
  });
  return data;
};

export const getMappedDataList = async ({
  context,
  appDir = false,
  ...args
}: GetMappedDataListParams) => {
  const { data: fetchData, total, error } = await fetchDataList(args);

  const rawData = cloneDeep(fetchData);

  return {
    data: mapDataList({ context, appDir, fetchData, ...args }),
    total,
    error,
    rawData: extractSerializable(rawData),
  };
};

const isVirtualField = <M extends ModelName>(
  displayOpts: (string & {}) | Field<M> | NoticeField | VirtualField<M>
): displayOpts is VirtualField<M> => {
  return typeof displayOpts === "object" && "dependsOn" in displayOpts;
};

export const selectPayloadForModel = <M extends ModelName>(
  resource: M,
  options?: EditOptions<M> | ListOptions<M>,
  level: "scalar" | "object" = "scalar"
) => {
  const model = getSchema().definitions[
    resource
  ] as SchemaDefinitions[ModelName];
  const properties = model.properties;
  const idProperty = getModelIdProperty(resource);

  const displayKeys = options?.display;
  const orderField = (options as ListOptions<M>)?.orderField;

  const defaultSelectedKeysForVirtualFields =
    options?.display
      ?.filter(isVirtualField)
      .flatMap((disp) => disp?.dependsOn)
      ?.reduce(
        (acc, val) => {
          if (val) {
            acc[val] = true;
          }
          return acc;
        },
        {} as Record<Field<M>, true>
      ) ?? {};

  let selectedFields = Object.entries(properties).reduce(
    (acc, [name, field]) => {
      const fieldNextAdmin = field.__nextadmin;

      if (orderField === name) {
        acc[name] = true;
      }

      if (
        (displayKeys && displayKeys.includes(name as Field<M>)) ||
        !displayKeys
      ) {
        if (fieldNextAdmin?.kind === "object" && level === "object") {
          if (fieldNextAdmin?.isList) {
            const countFields = acc["_count"]?.select ?? {};
            acc["_count"] = {
              select: {
                ...countFields,
                [name]: true,
              },
            };
          }
          acc[name] = {
            select: selectPayloadForModel(
              fieldNextAdmin.type as ModelName,
              {},
              "scalar"
            ),
          };

          const orderField =
            (options as EditOptions<M>)?.fields?.[
              name as Field<M>
              // @ts-expect-error
            ]?.orderField || (options as ListOptions<M>)?.orderField;

          if (orderField) {
            acc[name].orderBy = {
              [orderField]: "asc",
            };
          }
        } else {
          acc[name] = true;
        }
      }
      return acc;
    },
    modelHasIdField(resource)
      ? ({ [idProperty]: true, ...defaultSelectedKeysForVirtualFields } as any)
      : {}
  );

  return selectedFields;
};

export const getDataItem = async <M extends ModelName>({
  prisma,
  resource,
  options,
  resourceId,
  locale,
  isAppDir,
}: {
  options?: NextAdminOptions;
  prisma: PrismaClient;
  isAppDir?: boolean;
  locale?: string;
  resource: M;
  resourceId: string | number;
}) => {
  const edit = options?.model?.[resource]?.edit as EditOptions<typeof resource>;
  const idProperty = getModelIdProperty(resource);
  const select = selectPayloadForModel(resource, edit, "object");
  const schemaResourceProperties = getSchema().definitions[resource].properties;

  Object.entries(select).forEach(([key, value]) => {
    const fieldType =
      schemaResourceProperties[key as keyof typeof schemaResourceProperties]
        ?.__nextadmin?.type;

    if (fieldType) {
      const relatedResourceOptions =
        options?.model?.[fieldType as ModelName]?.list;

      if (
        edit?.fields?.[
          key as Field<ModelName>
          // @ts-expect-error
        ]?.display === "table"
      ) {
        if (!relatedResourceOptions?.display) {
          throw new Error(
            `'table' display mode set for field '${key}', but no list display is setup for model ${fieldType}`
          );
        }

        select[key] = {
          select: selectPayloadForModel(
            fieldType as ModelName,
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

  const relationshipsRawData: Record<string, any[]> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const fieldType =
        schemaResourceProperties[key as keyof typeof schemaResourceProperties]
          ?.__nextadmin?.type;

      relationshipsRawData[key] = cloneDeep(value);

      if (fieldType) {
        if (
          edit?.fields?.[
            key as Field<ModelName>
            // @ts-expect-error
          ]?.display === "table"
        ) {
          data[key] = mapDataList({
            context: { locale },
            appDir: isAppDir,
            fetchData: value,
            options,
            resource: fieldType as ModelName,
          });
        }
      }
    }
  });

  data = await transformData(data, resource, edit ?? {}, options);

  return { data, relationshipsRawData };
};

type DeepIncludeRecord = Record<string, true | any>;

const includeDataByDepth = <M extends ModelName>(
  modelProperties: SchemaDefinitions[ModelName]["properties"],
  currentDepth: number,
  maxDepth: number
) => {
  const include = Object.entries(modelProperties)?.reduce(
    (acc, [name, field]) => {
      if (field.__nextadmin?.kind === "object") {
        /**
         * We substract because, if the condition matches,
         * we will have all the fields in the related model, which are
         * counted in currentDepth + 1
         */
        if (currentDepth < maxDepth - 1) {
          const nextModel =
            getSchema().definitions[field.__nextadmin.type as M].properties;
          acc[name] = {
            include: includeDataByDepth(nextModel, currentDepth + 1, maxDepth),
          };
        } else {
          acc[name] = true;
        }
      }
      return acc;
    },
    {} as DeepIncludeRecord
  );

  return include;
};

/**
 * Get raw data from Prisma (2-deep nested relations)
 * @param prisma
 * @param resource
 * @param resourceId
 * @returns
 */
export const getRawData = async <M extends ModelName>({
  prisma,
  resource,
  resourceIds,
  maxDepth = 2,
}: {
  prisma: PrismaClient;
  resource: M;
  resourceIds: Array<string | number>;
  maxDepth?: number;
}): Promise<Model<M>[]> => {
  const model = getSchema().definitions[
    resource
  ] as SchemaDefinitions[ModelName];
  const modelProperties = model.properties;

  const include = includeDataByDepth(modelProperties!, 1, maxDepth);
  const idProperty = getModelIdProperty(resource);

  // @ts-expect-error
  const data = await prisma[resource].findMany({
    where: { [idProperty]: { in: resourceIds } },
    include,
  });

  return data;
};
