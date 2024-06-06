import { $Enums, Prisma, PrismaClient } from "@prisma/client";
import { cloneDeep } from "lodash";
import { ITEMS_PER_PAGE } from "../config";
import {
  EditOptions,
  Enumeration,
  Field,
  Filter,
  ListOptions,
  ModelName,
  NextAdminContext,
  NextAdminOptions,
  Order,
  PrismaListRequest,
  Select,
} from "../types";
import {
  enumValueForEnumType,
  findRelationInData,
  getModelIdProperty,
  getPrismaModelForResource,
  getToStringForRelations,
  modelHasIdField,
} from "./server";
import { capitalize, isScalar, uncapitalize } from "./tools";

export const createWherePredicate = (
  fieldsFiltered?: readonly Prisma.DMMF.Field[],
  search?: string,
  otherFilters?: Filter<ModelName>[]
) => {
  const searchFilter = search
    ? {
        OR: fieldsFiltered
          ?.filter((field) => {
            return field.kind === "scalar" || field.kind === "enum";
          })
          .map((field) => {
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

  return { AND: [...externalFilters, searchFilter] };
};

export const getFieldsFiltered = <M extends ModelName>(
  resource: M,
  options?: NextAdminOptions
): readonly Prisma.DMMF.Field[] => {
  const model = getPrismaModelForResource(resource);

  let fieldsFiltered = model?.fields;
  const list = options?.model?.[resource]?.list as ListOptions<M>;
  if (list) {
    fieldsFiltered = list?.search
      ? model?.fields.filter(
          ({ name }) => list.search?.includes(name as Field<M>)
        )
      : fieldsFiltered;
  }

  return fieldsFiltered as readonly Prisma.DMMF.Field[];
};

export const preparePrismaListRequest = <M extends ModelName>(
  resource: M,
  searchParams: any,
  options?: NextAdminOptions,
  skipFilters: boolean = false
): PrismaListRequest<M> => {
  const model = getPrismaModelForResource(resource);
  const search = searchParams.get("search") || "";
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
  let fieldsFiltered = getFieldsFiltered(resource, options);
  const list = options?.model?.[resource]?.list as ListOptions<M>;
  select = selectPayloadForModel(resource, list, "object");
  where = createWherePredicate(fieldsFiltered, search, fieldFilters);

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
  options: NextAdminOptions;
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
    args.options.model?.[originResource]?.edit?.fields?.[
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
  options: NextAdminOptions;
  searchParams: URLSearchParams;
};

export const fetchDataList = async (
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
  const listFields = options.model?.[resource]?.list?.fields ?? {};
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

export const includeOrderByPayloadForModel = <M extends ModelName>(
  resource: M,
  options: EditOptions<M>
) => {
  const model = getPrismaModelForResource(resource);

  let orderedFields = model?.fields.reduce(
    (acc, field) => {
      // @ts-expect-error
      if (options.fields?.[field.name as Field<M>]?.orderField) {
        acc[field.name] = {
          orderBy: {
            // @ts-expect-error
            [options.fields[field.name as Field<M>].orderField]: "asc",
          },
        };
      }
      return acc;
    },
    {} as Record<string, any>
  );

  return orderedFields;
};
