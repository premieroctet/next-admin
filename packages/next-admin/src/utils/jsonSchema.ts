import { Prisma } from "@prisma/client";
import { UiSchema } from "@rjsf/utils";
import { EditFieldsOptions, Field, ModelName } from "../types";

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

export function getSchemas<M extends ModelName>(
  data: any,
  schema: any,
  dmmfSchema: readonly Prisma.DMMF.Field[],
  editFieldsOptions?: EditFieldsOptions<M>
): Schemas & { edit: boolean; id?: string | number } {
  const uiSchema: UiSchema = {};
  let edit = false;
  let id;

  const { disabledFields, requiredFields } = Object.entries(
    editFieldsOptions ?? {}
  ).reduce<{ disabledFields: string[]; requiredFields: string[] }>(
    (acc, [name, opts]: [string, EditFieldsOptions<M>[Field<M>]]) => {
      if (opts?.disabled) {
        acc.disabledFields.push(name);
      }
      if (opts?.required) {
        acc.requiredFields.push(name);
      }
      return acc;
    },
    { requiredFields: [], disabledFields: [] }
  );

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
        requiredFields?.includes(dmmfProperty.name) &&
        !schema.require?.includes(dmmfProperty.name)
      ) {
        schema.required = [...(schema.required ?? []), dmmfProperty.name];
      }

      if (
        dmmfProperty &&
        (dmmfProperty.isId ||
          dmmfProperty.name === "createdAt" ||
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
