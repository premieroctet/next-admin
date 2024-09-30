import type { JSONSchema7Definition } from "json-schema";

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
  kind: "scalar" | "object" | "enum" | "unsupported";
  type?: NextAdminJsonSchemaDataType;
  disabled?: boolean;
  isList?: boolean;
  enum?: {
    $ref: string;
  };
  relation?: NextAdminJsonSchemaRelation;
};

declare module "json-schema" {
  interface JSONSchema7 {
    __nextadmin?: NextAdminJsonSchemaData;
  }
}

export const injectIntoJsonSchemaDefinition = (
  schema: JSONSchema7Definition,
  data: NextAdminJsonSchemaData
) => {
  if (typeof schema !== "object") {
    return;
  }
  schema.__nextadmin = data;
};
