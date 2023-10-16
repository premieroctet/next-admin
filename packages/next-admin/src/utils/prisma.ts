import { Prisma, PrismaClient } from "@prisma/client";
import { findRelationInData, getPrismaModelForResource } from "./server";
import {
  ListFieldsOptions,
  ModelName,
  NextAdminOptions,
  Order,
  PrismaListRequest,
  Select,
  UField,
} from "../types";
import { ITEMS_PER_PAGE } from "../config";
import { capitalize } from "./tools";

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
  const sortParam = searchParams.get("sortColumn") as UField<typeof resource>;
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
  const list = options?.model?.[resource]?.list
    ?.fields as ListFieldsOptions<M>;
  if (list) {
    const listKeys = Object.keys(list) as Array<keyof ListFieldsOptions<M>>;
    select = listKeys.reduce((acc, column) => {
      const field = model?.fields.find(({ name }) => name === column);
      if (!list[column]?.display) return acc;
      if (field?.kind === "object") {
        if (!acc._count) acc._count = { select: {} };
        acc._count.select = { ...acc._count.select, [column]: true };
      } else {
        // @ts-expect-error
        acc[column] = true;
      }
      return acc;
    }, {} as Select<M>);

    if (!select.id) select.id = true;

    fieldsFiltered =
      model?.fields.filter(
        ({ name }) => list[name as keyof ListFieldsOptions<M>]?.search
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

export const getMappedDataList = async (prisma: PrismaClient, resource: ModelName, dmmfSchema: Prisma.DMMF.Model | undefined, options: NextAdminOptions, searchParams: URLSearchParams) => {
  const prismaListRequest = preparePrismaListRequest(
    resource,
    searchParams,
    options
  );
  let data: any[] = [];
  let total: number;
  let error = null;
  try {
    // @ts-expect-error
    data = await prisma[resource].findMany(prismaListRequest);
    // @ts-expect-error
    total = await prisma[resource].count({
      where: prismaListRequest.where,
    });
  } catch (e: any) {
    const { skip, take, orderBy } = prismaListRequest;
    // @ts-expect-error
    data = await prisma[resource].findMany({
      skip,
      take,
      orderBy,
    });
    // @ts-expect-error
    total = await prisma[resource].count();
    error = e.message ? e.message : e;
    console.error(e);
  }

  data = await findRelationInData(data, dmmfSchema?.fields);

  return {
    data,
    total,
    error,
  };
};