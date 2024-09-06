import z from "zod";
import set from "lodash.set";
import get from "lodash.get";
import { ModelName, Schema } from "../types";

export type QueryCondition =
  | "equals"
  | "not"
  | "in"
  | "notIn"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "contains"
  | "search"
  | "startsWith"
  | "endsWith";

export type Filter = {
  [key: string]:
    | {
        [key in QueryCondition]?: string | number;
      }
    | {
        some: QueryBlock | Filter;
      }
    | Filter;
};

export type QueryBlock =
  | {
      AND: QueryBlock[];
    }
  | {
      OR: QueryBlock[];
    }
  | Filter;

const queryConditionsSchema = z.union([
  z.literal("equals"),
  z.literal("not"),
  z.literal("in"),
  z.literal("notIn"),
  z.literal("lt"),
  z.literal("lte"),
  z.literal("gt"),
  z.literal("gte"),
  z.literal("contains"),
  z.literal("search"),
  z.literal("startsWith"),
  z.literal("endsWith"),
]);

const filterSchema: z.ZodType<Filter> = z.record(
  z.string(),
  z.union([
    z.record(queryConditionsSchema, z.union([z.string(), z.number()])),
    z.lazy(() => filterSchema),
    z.lazy(() => relationshipSchema),
  ])
);

const relationshipSchema: z.ZodType<{ some: QueryBlock | Filter }> = z.object({
  some: z.union([z.lazy(() => queryBlockSchema), z.lazy(() => filterSchema)]),
});

const queryBlockSchema: z.ZodType<QueryBlock> = z.union([
  z.object({ AND: z.lazy(() => queryBlockSchema.array()) }),
  z.object({ OR: z.lazy(() => queryBlockSchema.array()) }),
  filterSchema,
]);

export const validateQuery = (query: string) => {
  try {
    const parsed = JSON.parse(query);
    return queryBlockSchema.parse(parsed);
  } catch {
    return false;
  }
};

export const getQueryCondition = (condition: string) => {
  try {
    const queryCondition = queryConditionsSchema.parse(condition);

    return queryCondition;
  } catch {
    return false;
  }
};

const contentTypeFromSchemaType = (
  schemaType: Schema["type"],
  format: Schema["format"]
) => {
  const type = Array.isArray(schemaType) ? schemaType[0] : schemaType;

  switch (type) {
    case "string": {
      if (format === "date-time") {
        return "datetime";
      }
      return "text";
    }
    case "integer":
    case "number":
      return "number";
    default:
      return "text";
  }
};

export type UIQueryBlock = (
  | {
      type: "filter";
      path: string;
      condition: QueryCondition;
      value: string;
      contentType: "text" | "number" | "datetime";
    }
  | { type: "and" | "or"; children?: UIQueryBlock[] }
) & { id: string };

export const buildUIBlocks = <M extends ModelName>(
  blocks: QueryBlock | null,
  { resource, schema }: { resource: M; schema: Schema },
  fields: string[] = []
): UIQueryBlock[] => {
  if (blocks) {
    const entries = Object.entries(blocks);

    return entries
      .flatMap(([key, value]): UIQueryBlock | undefined => {
        if (key === "AND" || key === "OR") {
          return {
            type: key === "AND" ? "and" : "or",
            id: crypto.randomUUID(),
            children: value.flatMap((block: QueryBlock) => {
              return buildUIBlocks(block, { resource, schema }, fields);
            }),
          };
        } else {
          const resourceInSchema = schema.definitions[resource];
          const schemaProperty =
            resourceInSchema.properties[
              key as keyof typeof resourceInSchema.properties
            ];
          const conditionKey = Object.keys(value)[0];
          const queryCondition = getQueryCondition(conditionKey);

          if (schemaProperty) {
            if (queryCondition) {
              return {
                type: "filter",
                path: [...fields, key].join("."),
                condition: queryCondition,
                value: value[queryCondition] as string,
                id: crypto.randomUUID(),
                contentType: contentTypeFromSchemaType(
                  schemaProperty.type,
                  schemaProperty.format
                ),
              };
            } else {
              let isArrayConditionKey = conditionKey === "some";
              if (schemaProperty.type !== "array" && isArrayConditionKey) {
                /**
                 * Check that "some" is actually not a property of the model
                 */
                if (schemaProperty.properties?.some) {
                  isArrayConditionKey = false;
                } else {
                  return undefined;
                }
              }

              const childResourceName = (
                isArrayConditionKey
                  ? schemaProperty.items?.$ref
                  : schemaProperty.$ref
              )
                ?.split("/")
                ?.at(-1)! as keyof typeof schema.definitions;
              const childEntries = Object.entries(
                isArrayConditionKey ? value.some : value
              );

              // @ts-expect-error
              return childEntries
                .map(([childKey, childValue]) => {
                  if (childKey === "AND" || childKey === "OR") {
                    return {
                      type: childKey === "AND" ? "and" : "or",
                      id: crypto.randomUUID(),
                      children: (childValue as QueryBlock[])
                        .flatMap((block) => {
                          return buildUIBlocks(
                            block,
                            { resource: childResourceName, schema },
                            [...fields, key]
                          );
                        })
                        .filter(Boolean) as UIQueryBlock[],
                    };
                  }

                  return buildUIBlocks(
                    { [childKey]: childValue } as Filter,
                    { resource: childResourceName, schema },
                    [...fields, key]
                  );
                })
                .flat();
            }
          }

          return undefined;
        }
      })
      .filter(Boolean) as UIQueryBlock[];
  }

  return [];
};

export const buildQueryBlocks = <M extends ModelName>(
  blocks: UIQueryBlock[],
  { resource, schema }: { resource: M; schema: Schema },
  acc: QueryBlock = {},
  path = ""
) => {
  blocks.forEach((block) => {
    if (block.type === "and" || block.type === "or") {
      const children = block.children;
      if (children?.length) {
        const blockKey = block.type === "and" ? "AND" : "OR";
        const finalPath = [path, blockKey].filter(Boolean).join(".");

        set(acc, finalPath, []);
        block.children?.forEach((child, index) => {
          buildQueryBlocks(
            [child],
            { resource, schema },
            acc,
            `${finalPath}[${index}]`
          );
        })
      }
    } else if (block.type === "filter") {
      const [basePath, ...rest] = block.path.split(".");
      const resourceInSchema = schema.definitions[resource];

      const schemaProperty =
        resourceInSchema.properties[
          basePath as keyof typeof resourceInSchema.properties
        ];

      if (schemaProperty?.type === "array") {
        const childResource = schemaProperty.items?.$ref
          ?.split("/")
          ?.at(-1)!;

        if (!get(acc, [path, basePath].filter(Boolean))) {
          set(acc, [path, basePath].filter(Boolean).join("."), {
            some: {}
          })
        }
        buildQueryBlocks(
          [{
            ...block,
            path: rest.join(".")
          }],
          {
            resource: childResource as M,
            schema,
          },
          acc,
          [path, basePath, "some"].filter(Boolean).join(".")
        )
      } else if (schemaProperty?.$ref) {
        const childResource = schemaProperty.$ref.split("/").at(-1)!;
        
        if (!get(acc, [path, basePath].filter(Boolean))) {
          set(acc, [path, basePath].filter(Boolean).join("."), {})
        }
        buildQueryBlocks(
          [{
            ...block,
            path: rest.join(".")
          }],
          {
            resource: childResource as M,
            schema,
          },
          acc,
          [path, basePath].filter(Boolean).join('.')
        );
      } else {
        const condition = block.condition;
        const value =
          block.contentType === "number" ? +block.value : block.value;

        set(acc, [path, basePath].filter(Boolean).join("."), {
          [condition]: value,
        });
      }

    }
  });

  return acc;
};
