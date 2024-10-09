import { UiSchema } from "@rjsf/utils";
import {
  EditFieldsOptions,
  Field,
  ModelName,
  Schema,
  SchemaDefinitions,
  SchemaModel,
} from "../types";

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
  data: any,
  schema: SchemaDefinitions[M],
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

  const properties = schema.properties!;

  Object.keys(properties).forEach((property) => {
    if (
      requiredFields?.includes(property) &&
      !schema.required?.includes(property)
    ) {
      schema.required = [...(schema.required ?? []), property];
    }

    if (
      properties[property as keyof typeof properties]?.__nextadmin?.disabled ||
      disabledFields?.includes(property)
    ) {
      data
        ? (uiSchema[property] = {
            ...uiSchema[property],
            "ui:disabled": true,
          })
        : delete properties[property as keyof typeof properties];
    }
  });
  return { uiSchema, schema };
}

export const getDefinitionFromRef = (schema: Schema, ref: string) => {
  const [definition] = ref.split("/").reverse();
  return schema.definitions[definition as keyof typeof schema.definitions];
};
