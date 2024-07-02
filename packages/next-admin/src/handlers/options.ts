import { PrismaClient } from "@prisma/client";
import { optionsFromResource } from "../utils/prisma";
import { NextAdminOptions } from "../types";

export const handleOptionsSearch = (
  body: any,
  prisma: PrismaClient,
  options?: NextAdminOptions
) => {
  const { originModel, property, model, query, page, perPage } = body;

  return optionsFromResource({
    prisma,
    originResource: originModel,
    property: property,
    resource: model,
    options,
    context: {},
    searchParams: new URLSearchParams({
      search: query,
      page: page.toString(),
      itemsPerPage: perPage.toString(),
    }),
    appDir: false,
  });
};
