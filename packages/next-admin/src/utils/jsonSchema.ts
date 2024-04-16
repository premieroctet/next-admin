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
        !Object.keys(attributes.items || {}).includes("$ref") &&
        !Object.keys(attributes.anyOf?.[0] ?? {}).includes("$ref")
      ) {
        // @ts-expect-error
        filteredProperties[property] = attributes;
      }
    }
  );

  return filteredProperties;
}

export function getSchemaForResource(schema: any, resource: string) {
  let resourceSchema =
    schema.definitions[resource as keyof typeof schema.definitions];

  // Filters refs for now since we don't support them, this will be removed in a future version
  resourceSchema = {
    ...resourceSchema,
    properties: filterProperties(resourceSchema.properties),
  };
  return resourceSchema;
}

export function getSchemas(
  data: any,
  schema: any,
  dmmfSchema: Prisma.DMMF.Field[],
  disabledFields?: string[]
): Schemas & { edit: boolean; id?: string | number } {
  const uiSchema: UiSchema = {};
  let edit = false;
  let id;
  if (schema && dmmfSchema) {
    const idProperty = dmmfSchema.find((property) => property.isId);

    edit = !!data?.[idProperty?.name ?? "id"];
    id = data?.[idProperty?.name ?? "id"];
    Object.keys(schema.properties).forEach((property) => {
      const dmmfProperty = dmmfSchema.find(
        (dmmfProperty) => dmmfProperty.name === property
      );

      if (
        dmmfProperty &&
        ((dmmfProperty.hasDefaultValue &&
          typeof dmmfProperty.default === "object") ||
          dmmfProperty?.isUpdatedAt ||
          disabledFields?.includes(dmmfProperty.name))
      ) {
        edit
          ? (uiSchema[property] = {
              ...uiSchema[property],
              "ui:disabled": true,
            })
          : delete schema.properties[property];
      }
    });
  }
  return { uiSchema, schema, edit, id };
}
