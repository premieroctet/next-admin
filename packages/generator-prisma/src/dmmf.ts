import type { DMMF } from "@prisma/generator-helper";
import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import {
  injectIntoJsonSchemaDefinition,
  type NextAdminJsonSchemaDataType,
  type NextAdminJsonSchemaRelation,
} from "@premieroctet/next-admin-json-schema";

const isFieldDisabled = (field: DMMF.Field) => {
  const isDisabled = field.isReadOnly || field.isGenerated || field.isUpdatedAt;

  const isDateTime = field.type === "DateTime";

  const isCreatedAt =
    isDateTime &&
    field.hasDefaultValue &&
    typeof field.default === "object" &&
    "name" in field.default &&
    field.default.name === "now";

  return isDisabled || isCreatedAt;
};

export const getModelByName = (dmmf: DMMF.Document, modelName: string) => {
  return dmmf.datamodel.models.find((model) => model.name === modelName);
};

export const getRelationData = (
  dmmf: DMMF.Document,
  field: DMMF.Field,
  modelName: string
): NextAdminJsonSchemaRelation | undefined => {
  const hasRelation = !!field.relationName;

  if (!hasRelation) {
    return undefined;
  }

  const relationModel = getModelByName(dmmf, field.type);

  if (!relationModel) {
    return undefined;
  }

  const oppositeModelRelation = relationModel.fields.find(
    (f) => f.relationName === field.relationName && f.type === modelName
  );

  const from = oppositeModelRelation?.name;
  const to = field.name;

  return {
    $ref: `#/definitions/${field.type}`,
    fromField: from!,
    toField: to!,
  };
};

export const insertDmmfData = (
  dmmf: DMMF.Document,
  jsonSchema: JSONSchema7
) => {
  const models = jsonSchema.definitions as Record<string, JSONSchema7>;

  const enums = dmmf.datamodel.enums;

  enums.forEach((enumType) => {
    const enumValues = enumType.values;

    models[enumType.name] = {
      type: "string",
      enum: enumValues.map((value) => value.name),
    };
  });

  Object.entries(models).forEach(([modelName, model]) => {
    const properties = model.properties;
    const dmmfModel = dmmf.datamodel.models.find((m) => m.name === modelName);

    if (!dmmfModel || !properties) {
      return;
    }

    const fields = dmmfModel.fields;

    Object.entries(properties).forEach(([propertyName, property]) => {
      const dmmfField = fields.find((f) => f.name === propertyName);

      if (!dmmfField || typeof property !== "object") {
        return;
      }

      injectIntoJsonSchemaDefinition(model.properties![propertyName], {
        primaryKey: dmmfField.isId,
        kind: dmmfField.kind,
        type: dmmfField.type as NextAdminJsonSchemaDataType,
        disabled: isFieldDisabled(dmmfField),
        isList: dmmfField.isList,
        enum:
          dmmfField.kind === "enum"
            ? { $ref: `#/definitions/${dmmfField.type}` }
            : undefined,
        relation: getRelationData(dmmf, dmmfField, dmmfModel.name),
      });
    });
  });

  return jsonSchema;
};
