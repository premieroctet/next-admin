"use server";

import { PrismaClient } from "@prisma/client";
import { ActionFullParams, ModelName } from "../types";
import { optionsFromResource } from "../utils/prisma";
import { getModelIdProperty } from "../utils/server";
import { uncapitalize } from "../utils/tools";

export const deleteResourceItems = async <M extends ModelName>(
  prisma: PrismaClient,
  model: M,
  ids: string[] | number[]
) => {
  const modelIdProperty = getModelIdProperty(model);
  // @ts-expect-error
  await prisma[uncapitalize(model)].deleteMany({
    where: {
      [modelIdProperty]: { in: ids },
    },
  });
};

export type SearchPaginatedResourceParams = {
  originModel: string;
  property: string;
  model: string;
  query: string;
  page?: number;
  perPage?: number;
};

export const searchPaginatedResource = async (
  { options, prisma }: ActionFullParams,
  {
    originModel,
    property,
    model,
    query,
    page = 1,
    perPage = 25,
  }: SearchPaginatedResourceParams
) => {
  const data = await optionsFromResource({
    prisma,
    originResource: originModel as ModelName,
    property: property,
    resource: model as ModelName,
    options,
    context: {},
    searchParams: new URLSearchParams({
      search: query,
      page: page.toString(),
      itemsPerPage: perPage.toString(),
    }),
    appDir: true,
  });

  return data;
};
