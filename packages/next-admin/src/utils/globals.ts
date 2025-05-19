import { ModelName, Schema } from "../types";

let schema: Schema | null = null;
let resources: ModelName[] | null = null;

export const initGlobals = async () => {
  try {
    if (schema && resources) {
      return;
    }

    // @ts-expect-error
    const schemaDef = await import("@premieroctet/next-admin/schema");

    schema = schemaDef.default as Schema;
    resources = Object.keys(schema.definitions).filter((modelName) => {
      // Enums are not resources
      return !schema!.definitions[modelName as ModelName].enum;
    }) as ModelName[];
  } catch (e) {
    console.error(e);
    throw new Error(
      "Schema not found, make sure you added the generator to your schema.prisma file"
    );
  }
};

export const getSchema = () => {
  if (!schema) {
    throw new Error("Schema not initialized");
  }
  return schema;
};

export const getResources = () => {
  if (!resources) {
    throw new Error("Resources not initialized");
  }
  return resources;
};
