import { JSONSchema7 } from "json-schema";
import get from "lodash.get";
import set from "lodash.set";
import z from "zod";
import { TranslationFn } from "../context/I18nContext";
import { ModelName, ModelOptions, Schema, SchemaModel } from "../types";

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
  | "endsWith"
  | "null"
  | "nnull"
  | "has";

type FilterValue = string | number | boolean | null;

export type Filter = {
  [key: string]:
    | {
        [key in QueryCondition]?: FilterValue | FilterValue[];
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
  // Scalar arrays
  z.literal("has"),
]);

const filterSchema: z.ZodType<Filter> = z.record(
  z.string(),
  z.union([
    z.record(
      queryConditionsSchema,
      z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.any())])
    ),
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
  } catch (e) {
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

export const contentTypeFromSchemaType = (schemaProperty: Schema) => {
  const { type: schemaType, format, enum: schemaEnum } = schemaProperty;
  const type = Array.isArray(schemaType) ? schemaType[0] : schemaType;

  switch (type) {
    case "string": {
      if (format === "date-time") {
        return "datetime";
      }
      if (schemaEnum) {
        return "enum";
      }
      return "text";
    }
    case "integer":
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "text";
  }
};

export const isFieldNullable = (schemaType: Schema["type"]) => {
  const isArrayType = Array.isArray(schemaType);

  if (isArrayType) {
    return schemaType.includes("null");
  }

  return schemaType === "null";
};

export type UIQueryBlock = (
  | {
      type: "filter";
      path: string;
      condition: QueryCondition;
      value: string | number | boolean | null;
      contentType: "text" | "number" | "datetime" | "boolean" | "enum";
      enum?: string[];
      defaultValue?: string | number | boolean | null;
      canHaveChildren: false;
      // internalPath is used to keep track of the path in the query block
      internalPath?: string;
      nullable: boolean;
      displayPath?: string;
    }
  | { type: "and" | "or"; children?: UIQueryBlock[]; internalPath?: string }
) & { id: string };

export const isSchemaPropertyScalarArray = (
  definition: SchemaModel<ModelName>,
  property: string
) => {
  const schemaProperty =
    definition.properties[property as keyof typeof definition.properties];

  return schemaProperty?.type === "array" && !schemaProperty.items?.$ref;
};

export const setInternalPathToBlocks = (blocks: UIQueryBlock[], path = "") => {
  blocks.forEach((block, index) => {
    block.internalPath = `${path}[${index}]`;
    if (block.type !== "filter" && block.children) {
      setInternalPathToBlocks(block.children, `${path}[${index}].children`);
    }
  });
};

export const cleanEmptyBlocks = (blocks: UIQueryBlock[]): UIQueryBlock[] => {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block) {
      if (block.type !== "filter" && block.children) {
        block.children = cleanEmptyBlocks(block.children);
      }
    }
  }

  const indicesToRemove: number[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (!block) {
      indicesToRemove.push(i);
    }
  }

  indicesToRemove.forEach((idx) => {
    blocks.splice(idx, 1);
  });

  return blocks;
};

const getConditionFromValue = (
  value: FilterValue | FilterValue[],
  condition: QueryCondition
) => {
  if (value === null) {
    return condition === "equals" ? "null" : "nnull";
  }

  if (condition === "has") {
    return "equals";
  }

  return condition;
};

const getQueryBlockValue = (
  value: FilterValue | FilterValue[],
  contentType: "text" | "number" | "datetime" | "boolean" | "enum",
  condition: QueryCondition
) => {
  if (contentType === "datetime") {
    try {
      const dateString = new Date(value as string).toJSON();

      return dateString.substring(0, dateString.length - 8);
    } catch {
      return value;
    }
  }

  if ((condition === "in" || condition === "notIn") && Array.isArray(value)) {
    return value.join(", ");
  }

  return value;
};

export const buildUIBlocks = <M extends ModelName>(
  blocks: QueryBlock | null,
  {
    resource,
    schema,
    options,
    t,
  }: {
    resource: M;
    schema: Schema;
    options?: ModelOptions<ModelName>;
    t?: TranslationFn;
  },
  fields: string[] = [],
  displayFields: string[] = []
): UIQueryBlock[] => {
  if (blocks) {
    const entries = Object.entries(blocks);

    const uiBlocks = entries
      .flatMap(([key, value]): UIQueryBlock | undefined => {
        if (key === "AND" || key === "OR") {
          return {
            type: key === "AND" ? "and" : "or",
            id: crypto.randomUUID(),
            children: value.flatMap((block: QueryBlock) => {
              return buildUIBlocks(
                block,
                { resource, schema, options },
                fields,
                displayFields
              );
            }),
          };
        } else {
          const resourceInSchema = schema.definitions[resource];
          const schemaProperty =
            resourceInSchema.properties[
              key as keyof typeof resourceInSchema.properties
            ];
          const conditions = Object.entries(value as Filter);
          const displayKeyFallback = options?.[resource]?.aliases?.[key] ?? key;
          const displayKey =
            t?.(`model.${resource}.fields.${key}`, {}, displayKeyFallback) ??
            displayKeyFallback;

          if (schemaProperty) {
            // @ts-expect-error
            return conditions.flatMap(([conditionKey]) => {
              const queryCondition = getQueryCondition(conditionKey);

              if (queryCondition) {
                const queryValue = value[conditionKey] as
                  | string
                  | number
                  | boolean
                  | null;
                const contentType = contentTypeFromSchemaType(
                  schemaProperty as Schema
                );
                return {
                  type: "filter",
                  path: [...fields, key].join("."),
                  condition: getConditionFromValue(queryValue, queryCondition),
                  value: getQueryBlockValue(
                    queryValue,
                    contentType,
                    queryCondition
                  ),
                  id: crypto.randomUUID(),
                  ...(contentType === "enum"
                    ? { enum: schemaProperty.enum }
                    : {}),
                  defaultValue: schemaProperty.default,
                  contentType: contentType,
                  canHaveChildren: false,
                  nullable: isFieldNullable(schemaProperty.type),
                  displayPath: [...displayFields, displayKey].join(" → "),
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
                    ? schemaProperty.items?.$ref || (schemaProperty?.anyOf?.[0] as JSONSchema7)?.$ref
                    : schemaProperty.$ref || (schemaProperty?.anyOf?.[0] as JSONSchema7)?.$ref
                )
                  ?.split("/")
                  ?.at(-1)! as keyof typeof schema.definitions;
                const childEntries = Object.entries(
                  isArrayConditionKey ? value.some : value
                );

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
                              { resource: childResourceName, schema, options },
                              [...fields, key],
                              [...displayFields, displayKey]
                            );
                          })
                          .filter(Boolean) as UIQueryBlock[],
                      };
                    }

                    return buildUIBlocks(
                      { [childKey]: childValue } as Filter,
                      { resource: childResourceName, schema, options },
                      [...fields, key],
                      [...displayFields, displayKey]
                    );
                  })
                  .flat();
              }
            });
          }

          return undefined;
        }
      })
      .filter(Boolean) as UIQueryBlock[];

    setInternalPathToBlocks(uiBlocks);

    return uiBlocks;
  }

  return [];
};

const getValueForUiBlock = (block: UIQueryBlock) => {
  if (block.type === "filter") {
    if (block.condition === "null" || block.condition === "nnull") {
      return null;
    }

    if (block.contentType === "datetime") {
      return new Date(block.value as string).toISOString();
    }

    if (block.condition === "in" || block.condition === "notIn") {
      return (block.value as string)
        .split(",")
        .map((val) => {
          val = val.trim();
          if (block.contentType === "number") {
            return +val;
          }

          return val;
        })
        .filter(Boolean);
    }

    if (block.contentType === "number" && !!block.value) {
      return +block.value;
    }

    return block.value;
  }
};

const getQueryBlockValueForUiBlock = (uiBlock: UIQueryBlock) => {
  if (uiBlock.type === "filter") {
    if (uiBlock.condition === "null") {
      return {
        equals: null,
      };
    }

    if (uiBlock.condition === "nnull") {
      return {
        not: null,
      };
    }

    return {
      [uiBlock.condition]: getValueForUiBlock(uiBlock),
    };
  }

  return {};
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
        });
      }
    } else if (block.type === "filter") {
      const [basePath, ...rest] = block.path.split(".");
      const resourceInSchema = schema.definitions[resource];

      const schemaProperty =
        resourceInSchema.properties[
          basePath as keyof typeof resourceInSchema.properties
        ];

      if (schemaProperty?.type === "array") {
        if (isSchemaPropertyScalarArray(resourceInSchema, basePath)) {
          set(acc, [path, basePath].filter(Boolean).join("."), {
            has: getValueForUiBlock(block),
          });
        } else {
          const childResource = schemaProperty.items?.$ref?.split("/")?.at(-1)!;

          if (!get(acc, [path, basePath].filter(Boolean))) {
            set(acc, [path, basePath].filter(Boolean).join("."), {
              some: {},
            });
          }
          buildQueryBlocks(
            [
              {
                ...block,
                path: rest.join("."),
              },
            ],
            {
              resource: childResource as M,
              schema,
            },
            acc,
            [path, basePath, "some"].filter(Boolean).join(".")
          );
        }
      } else if (
        schemaProperty &&
        (schemaProperty?.$ref || (schemaProperty?.anyOf?.[0] as JSONSchema7)?.$ref)
      ) {
        const ref =
          schemaProperty.$ref ||
          (schemaProperty.anyOf?.[0] as JSONSchema7)?.$ref;
        const childResource = ref!.split("/").at(-1)!;

        if (!get(acc, [path, basePath].filter(Boolean))) {
          set(acc, [path, basePath].filter(Boolean).join("."), {});
        }
        buildQueryBlocks(
          [
            {
              ...block,
              path: rest.join("."),
            },
          ],
          {
            resource: childResource as M,
            schema,
          },
          acc,
          [path, basePath].filter(Boolean).join(".")
        );
      } else {
        set(acc, [path, basePath].filter(Boolean).join("."), {
          ...get(acc, [path, basePath].filter(Boolean)),
          ...getQueryBlockValueForUiBlock(block),
        });
      }
    }
  });

  return acc;
};
