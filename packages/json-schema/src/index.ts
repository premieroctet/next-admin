import type { JSONSchema7Definition, JSONSchema7 } from "json-schema";

export type NextAdminJsonSchemaDataType =
  | "BigInt"
  | "Int"
  | "Float"
  | "Decimal"
  | "String"
  | "Boolean"
  | "DateTime"
  | "Json"
  | (string & {});

export type NextAdminJsonSchemaRelation = {
  $ref: string;
  fromField: string;
  toField: string;
};

export type NextAdminJsonSchemaData = {
  primaryKey?: boolean;
  primaryKeyField?: {
    name: string;
    fields?: string[];
  };
  kind?: "scalar" | "object" | "enum" | "unsupported";
  type?: NextAdminJsonSchemaDataType;
  disabled?: boolean;
  isList?: boolean;
  enum?: {
    $ref: string;
  };
  relation?: NextAdminJsonSchemaRelation;
};

export interface NextAdminJSONSchema extends JSONSchema7 {
  __nextadmin?: NextAdminJsonSchemaData;
}

export const injectIntoJsonSchemaDefinition = (
  schema: NextAdminJSONSchema,
  data: NextAdminJsonSchemaData
) => {
  if (typeof schema !== "object") {
    return;
  }
  schema.__nextadmin = data;
};
