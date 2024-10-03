import type { JSONSchema7 } from "json-schema";

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
  /**
   * The relation field name in the distant object
   *
   * Example: posts
   */
  fromField: string;
  /**
   * The db relation field name in the current object
   *
   * Example: author_id
   */
  fromFieldDbName?: string;
  /**
   * The relation field name in the current object
   *
   * Example: posts
   */
  toField: string;
  /**
   * The db relation field name in the distant object
   *
   * Example: id
   */
  toFieldDbName?: string;
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
  required?: boolean;
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
