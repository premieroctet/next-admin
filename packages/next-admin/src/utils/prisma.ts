import { Prisma, PrismaClient } from "@prisma/client";
import { ITEMS_PER_PAGE } from "../config";
import {
  EditOptions,
  Field,
  ListOptions,
  ModelName,
  NextAdminContext,
  NextAdminOptions,
  Order,
  PrismaListRequest,
  Select,
} from "../types";
import { findRelationInData, getPrismaModelForResource } from "./server";
import { capitalize, isScalar, uncapitalize } from "./tools";

export const createWherePredicate = (
  fieldsFiltered?: Prisma.DMMF.Field[],
  search?: string
) => {
  return search
    ? {
        OR: fieldsFiltered
          ?.filter((field) => field.kind === "scalar")
          .map((field) => {
            if (field.type === "String") {
              return {
                [field.name]: { contains: search, mode: "insensitive" },
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
};

export const preparePrismaListRequest = <M extends ModelName>(
  resource: M,
  searchParams: any,
  options?: NextAdminOptions
): PrismaListRequest<M> => {
  const model = getPrismaModelForResource(resource);
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const itemsPerPage =
    Number(searchParams.get("itemsPerPage")) || ITEMS_PER_PAGE;

  let orderBy: Order<typeof resource> = {};
  const sortParam = searchParams.get("sortColumn") as Field<typeof resource>;
  const orderValue = searchParams.get("sortDirection") as Prisma.SortOrder;
  if (
    orderValue in Prisma.SortOrder &&
    sortParam in Prisma[`${capitalize(resource)}ScalarFieldEnum`]
  ) {
    orderBy[sortParam] = orderValue;
  }

  let select: Select<M> | undefined;
  let where = {};
  let fieldsFiltered = model?.fields;
  const list = options?.model?.[resource]?.list as ListOptions<M>;
  if (list) {
    const listDisplayedKeys = list.display;
    select = listDisplayedKeys?.reduce(
      (acc, column) => {
        const field = model?.fields.find(({ name }) => name === column);
        if (field?.kind === "object" && field?.isList === true) {
          if (!acc._count) acc._count = { select: {} };
          acc._count.select = { ...acc._count.select, [column]: true };
        } else {
          // @ts-expect-error
          acc[column] = true;
        }
        return acc;
      },
      { id: true } as Select<M>
    );

    fieldsFiltered =
      model?.fields.filter(
        ({ name }) => list.search?.includes(name as Field<M>)
      ) ?? fieldsFiltered;
  }
  where = createWherePredicate(fieldsFiltered, search);

  return {
    select,
    where,
    orderBy,
    skip: (page - 1) * itemsPerPage,
    take: itemsPerPage,
  };
};

export const getMappedDataList = async (
  prisma: PrismaClient,
  resource: ModelName,
  options: NextAdminOptions,
  searchParams: URLSearchParams,
  context: NextAdminContext,
  appDir = false
) => {
  const prismaListRequest = preparePrismaListRequest(
    resource,
    searchParams,
    options
  );
  let data: any[] = [];
  let total: number;
  let error = null;
  const dmmfSchema = getPrismaModelForResource(resource);

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
  data = await findRelationInData(data, dmmfSchema?.fields);

  const listFields = options.model?.[resource]?.list?.fields ?? {};

  data.forEach((item, index) => {
    Object.keys(item).forEach((key) => {
      let itemValue;

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
            itemValue = item[key].id;
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
        listFields[key as keyof typeof listFields]?.formatter &&
        !!itemValue
      ) {
        item[key].__nextadmin_formatted = listFields[
          key as keyof typeof listFields
          // @ts-expect-error
        ]?.formatter?.(itemValue ?? item[key], context);
      } else {
        data[index][key] = item[key];
      }
    });
  });

  return {
    data,
    total,
    error,
  };
};
