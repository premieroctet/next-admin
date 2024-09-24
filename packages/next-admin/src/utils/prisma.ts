import { $Enums, Prisma, PrismaClient } from "@prisma/client";
import { cloneDeep } from "lodash";
import { ITEMS_PER_PAGE } from "../config";
import {
  EditOptions,
  Enumeration,
  Field,
  Filter,
  ListOptions,
  Model,
  ModelName,
  NextAdminContext,
  NextAdminOptions,
  Order,
  PrismaListRequest,
  Select,
} from "../types";
import { validateQuery } from "./advancedSearch";
import {
  enumValueForEnumType,
  findRelationInData,
  getModelIdProperty,
  getPrismaModelForResource,
  getToStringForRelations,
  modelHasIdField,
  transformData,
} from "./server";
import { capitalize, isScalar, uncapitalize } from "./tools";

type CreateNestedWherePredicateParams<M extends ModelName> = {
  field: Prisma.DMMF.Field;
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
  const resource = getPrismaModelForResource(field.type as ModelName);

  acc[field.name] = {
    OR: searchOptions
      ?.map((searchOption) => {
        const [_, subFieldName, ...rest] = searchOption.toString().split(".");
        const subField = resource?.fields.find(
          ({ name }) => name === subFieldName
        );

        if (!subField) {
          return null;
        } else if (subField.kind === "scalar") {
          if (subField.isList) {
            let searchTerm: string | number = search;

            if (subField.type !== "String" && !isNaN(Number(search))) {
              searchTerm = Number(search);
            }

            return {
              has: searchTerm,
            };
          }

          if (subField.type === "String") {
            // @ts-ignore
            const mode = Prisma?.QueryMode
              ? { mode: Prisma.QueryMode.insensitive }
              : {};
            return {
              [subFieldName]: { contains: search, ...mode },
            };
          }
          if (subField.type === "Int" && !isNaN(Number(search))) {
            return { [subFieldName]: Number(search) };
          }
        } else if (subField.kind === "object") {
          const predicate = createNestedWherePredicate({
            field: subField,
            options,
            search,
            searchOptions: [[subFieldName, ...rest].join(".")] as Field<M>[],
          });

          if (subField.isList) {
            predicate[subField.name] = {
              some: predicate[subField.name],
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
          ?.filter((field) => {
            return (
              field.kind === "scalar" ||
              field.kind === "enum" ||
              field.kind === "object"
            );
          })
          .map((field) => {
            if (field.kind === "object") {
              return createNestedWherePredicate({
                field,
                options,
                search,
                searchOptions: (
                  options?.model?.[resource]?.list?.search as string[]
                )?.filter((searchOption) =>
                  searchOption?.toString().startsWith(field.name)
                ) as Field<M>[],
              });
            }

            if (field.kind === "enum") {
              const enumValueForSearchTerm = enumValueForEnumType(
                field.type,
                search
              );

              if (enumValueForSearchTerm) {
                return {
                  [field.name]:
                    // @ts-expect-error
                    $Enums[field.type as keyof typeof $Enums][
                      enumValueForSearchTerm.name
                    ],
                };
              }
            }

            if (field.kind === "scalar" && field.isList) {
              if (field.type !== "String" && Number.isNaN(Number(search))) {
                return null;
              }

              return {
                [field.name]: {
                  has: field.type === "String" ? search : Number(search),
                },
              };
            }

            if (field.type === "String") {
              // @ts-ignore
              const mode = Prisma?.QueryMode
                ? { mode: Prisma.QueryMode.insensitive }
                : {};
              return {
                [field.name]: { contains: search, ...mode },
              };
            }
            if (field.type === "Int" && !isNaN(Number(search))) {
              return { [field.name]: Number(search) };
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
): readonly Prisma.DMMF.Field[] => {
  const model = getPrismaModelForResource(resource);

  let fieldsFiltered = model?.fields.filter((field) => field.kind === "scalar");
  const list = options?.model?.[resource]?.list as ListOptions<M>;
  if (list) {
    fieldsFiltered = list?.search
      ? model?.fields.filter(({ name }) =>
          (list.search as string[])?.some((search) => {
            const searchNameSplit = search?.toString().split(".");

            return searchNameSplit?.[0] === name;
          })
        )
      : fieldsFiltered;
  }

  return fieldsFiltered as readonly Prisma.DMMF.Field[];
};

const getWherePredicateFromQueryParams = (query: string) => {
  return validateQuery(query);
};

const preparePrismaListRequest = <M extends ModelName>(
  resource: M,
  searchParams: any,
  options?: NextAdminOptions,
  skipFilters: boolean = false
): PrismaListRequest<M> => {
  const model = getPrismaModelForResource(resource);
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

  const fieldFilters = options?.model?.[resource]?.list?.filters
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

  const modelFieldSortParam = model?.fields.find(
    ({ name }) => name === sortParam
  );

  if (orderValue in Prisma.SortOrder) {
    if (sortParam in Prisma[`${capitalize(resource)}ScalarFieldEnum`]) {
      orderBy[sortParam] = orderValue;
    } else if (modelFieldSortParam?.kind === "object") {
      if (modelFieldSortParam.isList) {
        orderBy[modelFieldSortParam.name as Field<M>] = {
          _count: orderValue,
        };
      } else {
        const modelFieldSortProperty =
          options?.model?.[resource]?.list?.fields?.[
            modelFieldSortParam.name as Field<M>
            // @ts-expect-error
          ]?.sortBy;

        const resourceSortByField =
          modelFieldSortProperty ??
          getModelIdProperty(modelFieldSortParam.type as ModelName);

        orderBy[modelFieldSortParam.name as Field<M>] = {
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
    otherFilters: fieldFilters,
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
    const targetModel = getPrismaModelForResource(args.resource);
    const modelField = targetModel?.fields.find(
      (field) => field.name === relationshipField
    );

    if (modelField && modelField.type !== "scalar") {
      args.resource = modelField.type as ModelName;
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
  const prismaListRequest = preparePrismaListRequest(
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
  const dmmfSchema = getPrismaModelForResource(resource);
  const data = findRelationInData(fetchData, dmmfSchema?.fields);
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
  const model = getPrismaModelForResource(resource);
  const idProperty = getModelIdProperty(resource);

  const displayKeys = options?.display;
  let selectedFields = model?.fields.reduce(
    (acc, field) => {
      if (
        (displayKeys && displayKeys.includes(field.name as Field<M>)) ||
        !displayKeys
      ) {
        if (field.kind === "object" && level === "object") {
          acc[field.name] = {
            select: selectPayloadForModel(
              field.type as ModelName,
              {},
              "scalar"
            ),
          };

          const orderField = (options as EditOptions<M>)?.fields?.[
            field.name as Field<M>
            // @ts-expect-error
          ]?.orderField;

          if (orderField) {
            acc[field.name].orderBy = {
              [orderField]: "asc",
            };
          }
        } else {
          acc[field.name] = true;
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
  const dmmfSchema = getPrismaModelForResource(resource);
  const edit = options?.model?.[resource]?.edit as EditOptions<typeof resource>;
  const idProperty = getModelIdProperty(resource);
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
  data = transformData(data, resource, edit ?? {}, options);
  return data;
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
}: {
  prisma: PrismaClient;
  resource: M;
  resourceIds: Array<string | number>;
}): Promise<Model<M>[]> => {
  const modelDMMF = getPrismaModelForResource(resource);

  const include = modelDMMF?.fields.reduce(
    (acc, field) => {
      if (field.kind === "object") {
        acc[field.name] = true;
      }
      return acc;
    },
    {} as Record<string, true>
  );

  // @ts-expect-error
  const data = await prisma[resource].findMany({
    where: { id: { in: resourceIds } },
    include,
  });

  return data;
};
