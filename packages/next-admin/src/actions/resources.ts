"use server";

import { PrismaClient } from "@prisma/client";
import { ModelName } from "../types";
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
