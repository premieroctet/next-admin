import { UiSchema } from "@rjsf/utils";
import {
  EditFieldsOptions,
  Field,
  ModelName,
  Schema,
  SchemaDefinitions,
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

export function getInfos<M extends ModelName>(
  data: any,
  schema: SchemaDefinitions[M]
) {
  let edit = false;
  let id;

  const properties = schema.properties!;
  const idProperty = Object.keys(properties).find((property) => {
    const propertyData = properties[property as keyof typeof properties];

    if (typeof propertyData === "boolean") {
      return false;
    }

    return propertyData?.__nextadmin?.primaryKey;
  });

  edit = !!data?.[idProperty ?? "id"];
  id = data?.[idProperty ?? "id"];

  return { edit, id };
}

export function modifySchema<M extends ModelName>(
  data: any,
  schema: SchemaDefinitions[M],
  editFieldsOptions?: EditFieldsOptions<M>
) {
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
      properties[property as keyof typeof properties]!.__nextadmin!.required = true;
    }

    if (
      properties[property as keyof typeof properties]?.__nextadmin?.disabled ||
      disabledFields?.includes(property)
    ) {
      const { edit } = getInfos(data, schema);
      if (edit) {
        if (properties[property as keyof typeof properties]?.__nextadmin) {
          properties[
            property as keyof typeof properties
          ]!.__nextadmin!.disabled = true;
        }
      } else {
        delete properties[property as keyof typeof properties];
      }
    }
  });
}

export const getDefinitionFromRef = (schema: Schema, ref: string) => {
  const [definition] = ref.split("/").reverse();
  return schema.definitions[definition as keyof typeof schema.definitions];
};
