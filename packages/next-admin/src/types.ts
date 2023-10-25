import { Prisma } from "@prisma/client";
import { JSONSchema7 } from "json-schema";
import { ReactNode } from "react";
import { PropertyValidationError } from "./exceptions/ValidationError";

/** Type for Model */

export type ModelName = Prisma.ModelName;

export type ScalarField<T extends ModelName> =
  Prisma.TypeMap["model"][T]["payload"]["scalars"];
export type ObjectField<T extends ModelName> =
  Prisma.TypeMap["model"][T]["payload"]["objects"];

export type Model<
  M extends ModelName,
  T extends object | number = object,
> = ScalarField<M> & {
  [P in keyof ObjectField<M>]: ObjectField<M>[P] extends { scalars: infer S }
    ? T extends object
      ? S
      : T
    : never | ObjectField<M>[P] extends { scalars: infer S }[]
      ? T extends object
        ? S[]
        : T[]
      : never | ObjectField<M>[P] extends { scalars: infer S } | null
        ? T extends object
          ? S | null
          : T | null
        : never;
};

export type ModelWithoutRelationships<M extends ModelName> = Model<M, number>;

export type Field<P extends ModelName> = keyof Model<P>;

/** Type for Form */

/** Type for Options */

export type ListFieldsOptions<T extends ModelName> = {
  [P in Field<T>]?: {
    formatter?: (item: Model<T>[P]) => ReactNode;
  };
};

export type EditFieldsOptions<T extends ModelName> = {
  [P in Field<T>]?: {
    validate?: (value: ModelWithoutRelationships<T>[P]) => true | string;
    format?: FormatOptions<ModelWithoutRelationships<T>[P]>;
    handler?: Handler<T, P, Model<T>[P]>;
  };
};

export type Handler<
  M extends ModelName,
  P extends Field<M>,
  T extends Model<M>[P],
> = {
  get?: (input: T) => any;
};

export type FormatOptions<T> = T extends string
  ?
      | "textarea"
      | "password"
      | "color"
      | "email"
      | "uri"
      | "data-url"
      | "date"
      | "date-time"
      | "time"
      | "alt-datetime"
      | "alt-date"
  : never | T extends Date
    ? "date" | "date-time" | "time"
    : never | T extends number
      ? "updown" | "range"
      : never;

export type ListOptions<T extends ModelName> = {
  display?: Field<T>[];
  search?: Field<T>[];
  fields?: ListFieldsOptions<T>;
};

export type EditOptions<T extends ModelName> = {
  display?: Field<T>[];
  fields?: EditFieldsOptions<T>;
};

export type ModelOptions<T extends ModelName> = {
  [P in T]?: {
    toString?: (item: Model<P>) => string;
    list?: ListOptions<P>;
    edit?: EditOptions<P>;
  };
};

export type NextAdminOptions = {
  basePath: string;
  model?: ModelOptions<ModelName>;
};

/** Type for Schema */

export type SchemaProperty<M extends ModelName> = {
  [P in Field<M>]?: JSONSchema7;
};

export type SchemaModel<M extends ModelName> = Partial<
  Omit<JSONSchema7, "properties">
> & {
  properties: SchemaProperty<M>;
};

export type SchemaDefinitions = {
  [M in ModelName]: SchemaModel<M>;
};

export type Schema = Partial<Omit<JSONSchema7, "definitions">> & {
  definitions: SchemaDefinitions;
};

export type FormData<M extends ModelName> = {
  [P in Field<M>]?: string;
};

export type Body<F> = {
  [P in keyof F]?: string;
} & {
  [key: string]: string;
};

export type Order<M extends ModelName> = {
  [P in Field<M>]?: Prisma.SortOrder;
};

export type Select<M extends ModelName> = {
  [P in Field<M>]?: boolean;
} & {
  _count: {
    select: {
      [key in string]: boolean;
    };
  };
};

export type Enumeration = {
  label: string;
  value: string;
};

export type PrismaListRequest<M extends ModelName> = {
  select?: Select<M>;
  where?: {};
  orderBy?: Order<M>;
  skip?: number;
  take?: number;
};

export type ListData<T extends ModelName> = ListDataItem<T>[];

export type ListDataItem<T extends ModelName> = Model<T> &
  Record<string, ListDataFieldValue>;

export type ListDataFieldValue =
  // | { type: "scalar"; value: string | number | boolean } -- not supported yet
  | number
  | string
  | boolean
  | { type: "count"; value: number }
  | {
      type: "link";
      value: {
        label: string;
        url: string;
      };
    }
  | {
      type: "date";
      value: Date;
    };

export type AdminComponentProps = {
  basePath: string;
  schema: Schema;
  data?: ListData<ModelName>;
  resource: ModelName;
  message?: {
    type: "success" | "info";
    content: string;
  };
  error?: string;
  validation?: PropertyValidationError[];
  resources?: ModelName[];
  total?: number;
  dmmfSchema: Prisma.DMMF.Field[];
  options?: NextAdminOptions;
};

export type CustomUIProps = {
  dashboard?: JSX.Element | (() => JSX.Element);
};