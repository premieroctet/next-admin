import { Prisma } from "@prisma/client";
import { getPrismaModelyForRessource } from "./server";
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
  ressource: M,
  searchParams: any,
  options?: NextAdminOptions
): PrismaListRequest<M> => {
  const model = getPrismaModelyForRessource(ressource);
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const itemsPerPage =
    Number(searchParams.get("itemsPerPage")) || ITEMS_PER_PAGE;

  let orderBy: Order<typeof ressource> = {};
  const sortParam = searchParams.get("sortColumn") as UField<typeof ressource>;
  const orderValue = searchParams.get("sortDirection") as Prisma.SortOrder;
  if (
    orderValue in Prisma.SortOrder &&
    sortParam in Prisma[`${capitalize(ressource)}ScalarFieldEnum`]
  ) {
    orderBy[sortParam] = orderValue;
  }

  let select: Select<M> | undefined;
  let where = {};
  let fieldsFiltered = model?.fields;
  const list = options?.model?.[ressource]?.list
    ?.fields as ListFieldsOptions<M>;
  if (list) {
    const listKeys = Object.keys(list) as Array<keyof ListFieldsOptions<M>>;
    select = listKeys.reduce(
      (acc, column) => {
        const field = model?.fields.find(({ name }) => name === column);
        if (field?.kind === "object") {
          if(!acc._count) acc._count = { select: {} };
          acc._count.select = { ...acc._count.select, [column]: true };
        } else {
          // @ts-expect-error
          acc[column] = true;
        }
        return acc;
      },
      {} as Select<M>
    );

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
