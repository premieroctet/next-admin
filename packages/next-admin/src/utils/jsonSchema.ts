import { Prisma } from "@prisma/client";
import { UiSchema } from "@rjsf/utils";

export type Schemas = {
  schema: any;
  uiSchema: UiSchema;
};

function filterProperties(properties: any): Record<string, any> {
  const filteredProperties = {};

  Object.entries<Record<string, any>>(properties).map(
    ([property, attributes]) => {
      if (
        !Object.keys(attributes).includes("$ref") &&
        !Object.keys(attributes.items || {}).includes("$ref")
      ) {
        // @ts-expect-error
        filteredProperties[property] = attributes;
      }
    }
  );

  return filteredProperties;
}

export function getSchemaForRessource(schema: any, ressource: string) {
  let ressourceSchema =
    schema.definitions[ressource as keyof typeof schema.definitions];

  // Filters refs for now since we don't support them, this will be removed in a future version
  ressourceSchema = {
    ...ressourceSchema,
    properties: filterProperties(ressourceSchema.properties),
  };
  return ressourceSchema;
}

export function getSchemas(
  data: any,
  schema: any,
  dmmfSchema: Prisma.DMMF.Field[]
): Schemas {
  const uiSchema: UiSchema = {};
  const edit = data?.id;
  if (schema && dmmfSchema) {
    Object.keys(schema.properties).forEach((property) => {
      const dmmfProperty = dmmfSchema.find(
        (dmmfProperty) => dmmfProperty.name === property
      );
      if (
        dmmfProperty &&
        ((dmmfProperty.hasDefaultValue &&
          typeof dmmfProperty.default === "object") ||
          dmmfProperty?.isUpdatedAt)
      ) {
        edit
          ? (uiSchema[property] = { "ui:disabled": true })
          : delete schema.properties[property];
      }
    });
  }
  return { uiSchema, schema };
}
