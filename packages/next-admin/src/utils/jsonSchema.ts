import { Prisma } from "@prisma/client";
import { UiSchema } from "@rjsf/utils";
import {
  EditFieldsOptions,
  Field,
  Model,
  ModelName,
  Schema,
  SchemaModel,
  SchemaProperty,
} from "../types";

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

export function getSchemaForResource(schema: Schema, resource: string) {
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
  schema: SchemaModel<M>,
  dmmfSchema: readonly Prisma.DMMF.Field[],
  data?: Model<M>,
  editFieldsOptions?: EditFieldsOptions<M>
): { schema: SchemaModel<M>; uiSchema: UiSchema } {
  const uiSchema: UiSchema = {};

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
    (Object.keys(schema.properties) as (keyof SchemaProperty<M>)[]).forEach(
      (property: Field<M>) => {
        const dmmfProperty = dmmfSchema.find(
          (dmmfProperty) => dmmfProperty.name === property
        );

        if (
          dmmfProperty &&
          requiredFields?.includes(dmmfProperty.name) &&
          !schema.required?.includes(dmmfProperty.name)
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
          data
            ? (uiSchema[property as string] = {
                ...uiSchema[property as string],
                "ui:disabled": true,
              })
            : delete schema.properties[property];
        }
      }
    );
  }
  return { uiSchema, schema };
}
