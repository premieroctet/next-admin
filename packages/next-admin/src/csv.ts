import { PrismaClient } from "@prisma/client";
import { ModelName, NextAdminOptions } from "./types";
import { getPrismaModelForResource } from "./utils/server";
import { uncapitalize } from "./utils/tools";

export const exportModelAsCsv = async (
  prisma: PrismaClient,
  model: ModelName,
  options: NextAdminOptions
) => {
  const listOptions = options.model?.[model]?.list;
  const modelDmmf = getPrismaModelForResource(model);

  // @ts-expect-error
  const rows = await prisma[uncapitalize(model)].findMany();

  let csvContent =
    listOptions?.display?.join(",") ?? Object.keys(rows[0]).join(",");
  csvContent += "\n";

  rows.forEach((row: any) => {
    csvContent +=
      Object.entries(row)
        .map(([key, value]) => {
          const fieldDmmf = modelDmmf?.fields.find(
            (field) => field.name === key
          );

          if (value !== null) {
            if (fieldDmmf?.kind === "object" && fieldDmmf.isList) {
              return (value as any[]).length.toString();
            } else {
              switch (fieldDmmf?.type) {
                case "Boolean":
                  return value ? "True" : "False";
                case "DateTime":
                  return (value as Date).toISOString();
                case "Int":
                  return value;
                case "Json":
                  return JSON.stringify(value);
                default: {
                  const val = value!.toString();
                  if (val.includes(",") || val.includes('"')) {
                    return `"${value!.toString().replace(/"/g, '""')}"`;
                  }

                  return val;
                }
              }
            }
          }

          return "";
        })
        .join(",") + "\n";
  });

  return csvContent;
};
