import type { NextAdminJsonSchemaData } from "@premieroctet/next-admin-json-schema";
import { Prisma, PrismaClient } from "@prisma/client";
import cloneDeep from "lodash.clonedeep";
import { ITEMS_PER_PAGE } from "../config";
import {
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
  Order,
  PrismaListRequest,
  SchemaDefinitions,
  SchemaProperty,
  Select,
} from "../types";
import { validateQuery } from "./advancedSearch";
import { getDefinitionFromRef } from "./jsonSchema";
import {
  enumValueForEnumType,
  findRelationInData,
  getModelIdProperty,
  getToStringForRelations,
  globalSchema,
  modelHasIdField,
  transformData,
} from "./server";
import { capitalize, isScalar, uncapitalize } from "./tools";

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
  const resource = globalSchema.definitions[field.type as ModelName];
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
                globalSchema,
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
  const model = globalSchema.definitions[
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
  const model = globalSchema.definitions[
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
    Number(searchParams.get("itemsPerPage")) || ITEMS_PER_PAGE;

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

  let orderBy: Order<typeof resource> = {};
  const sortParam =
    (searchParams.get("sortColumn") as Field<typeof resource>) ??
    fieldSort?.field;
  const orderValue =
    (searchParams.get("sortDirection") as Prisma.SortOrder) ??
    fieldSort?.direction;

  const modelFieldSortParam =
    modelProperties[sortParam as keyof typeof modelProperties];
  const modelFieldNextAdminData = modelFieldSortParam?.__nextadmin;

  if (orderValue in Prisma.SortOrder) {
    if (sortParam in Prisma[`${capitalize(resource)}ScalarFieldEnum`]) {
      orderBy[sortParam] = orderValue;
    } else if (modelFieldNextAdminData?.kind === "object") {
      if (modelFieldNextAdminData.isList) {
        orderBy[sortParam as Field<M>] = {
          _count: orderValue,
        };
      } else {
        const modelFieldSortProperty =
          options?.model?.[resource]?.list?.fields?.[
            sortParam as Field<M>
            // @ts-expect-error
          ]?.sortBy;

        const resourceSortByField =
          modelFieldSortProperty ??
          getModelIdProperty(modelFieldNextAdminData.type as ModelName);

        orderBy[sortParam as Field<M>] = {
          [resourceSortByField]: orderValue,
        };
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

  return {
    select,
    where,
    orderBy,
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
  const relationshipField =
    args.options?.model?.[originResource]?.edit?.fields?.[
      property as Field<typeof originResource>
      // @ts-expect-error
    ]?.relationshipSearchField;

  if (relationshipField) {
    const targetModel = globalSchema.definitions[args.resource];

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

  try {
    // @ts-expect-error
    data = await prisma[uncapitalize(resource)].findMany(prismaListRequest);
    // @ts-expect-error
    total = await prisma[uncapitalize(resource)].count({
      where: prismaListRequest.where,
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
  const data = findRelationInData(
    fetchData,
    globalSchema.definitions[resource]
  );
  const listFields = options?.model?.[resource]?.list?.fields ?? {};
  const originalData = cloneDeep(data);
  data.forEach((item, index) => {
    context.row = originalData[index];
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
        item[key] = {
          type: "scalar",
          value: item[key],
          __nextadmin_formatted: item[key].toString(),
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
  });
  return data;
};

export const getMappedDataList = async ({
  context,
  appDir = false,
  ...args
}: GetMappedDataListParams) => {
  const { data: fetchData, total, error } = await fetchDataList(args);

  return {
    data: mapDataList({ context, appDir, fetchData, ...args }),
    total,
    error,
  };
};

export const selectPayloadForModel = <M extends ModelName>(
  resource: M,
  options?: EditOptions<M> | ListOptions<M>,
  level: "scalar" | "object" = "scalar"
) => {
  const model = globalSchema.definitions[
    resource
  ] as SchemaDefinitions[ModelName];
  const properties = model.properties;
  const idProperty = getModelIdProperty(resource);

  const displayKeys = options?.display;
  let selectedFields = Object.entries(properties).reduce(
    (acc, [name, field]) => {
      const fieldNextAdmin = field.__nextadmin;

      if (
        (displayKeys && displayKeys.includes(name as Field<M>)) ||
        !displayKeys
      ) {
        if (fieldNextAdmin?.kind === "object" && level === "object") {
          acc[name] = {
            select: selectPayloadForModel(
              fieldNextAdmin.type as ModelName,
              {},
              "scalar"
            ),
          };

          const orderField = (options as EditOptions<M>)?.fields?.[
            name as Field<M>
            // @ts-expect-error
          ]?.orderField;

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
    modelHasIdField(resource) ? ({ [idProperty]: true } as any) : {}
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
  const schemaResourceProperties =
    globalSchema.definitions[resource].properties;

  Object.entries(select).forEach(([key, value]) => {
    const fieldType =
      schemaResourceProperties[key as keyof typeof schemaResourceProperties]
        ?.__nextadmin?.type;

    if (fieldType) {
      const relatedResourceOptions =
        options?.model?.[fieldType as ModelName]?.list;

      if (
        // @ts-expect-error
        edit?.fields?.[key as Field<ModelName>]?.display === "table"
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

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const fieldType =
        schemaResourceProperties[key as keyof typeof schemaResourceProperties]
          ?.__nextadmin?.type;

      if (fieldType) {
        if (
          // @ts-expect-error
          edit?.fields?.[key as Field<ModelName>]?.display === "table"
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

  data = transformData(data, resource, edit ?? {}, options);

  return data;
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
            globalSchema.definitions[field.__nextadmin.type as M].properties;
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
  const model = globalSchema.definitions[
    resource
  ] as SchemaDefinitions[ModelName];
  const modelProperties = model.properties;

  const include = includeDataByDepth(modelProperties!, 1, maxDepth);

  // @ts-expect-error
  const data = await prisma[resource].findMany({
    where: { id: { in: resourceIds } },
    include,
  });

  return data;
};
