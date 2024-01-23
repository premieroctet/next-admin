import { Prisma, PrismaClient } from "@prisma/client";
import { JSONSchema7 } from "json-schema";
import { ChangeEvent, ReactNode } from "react";
import { PropertyValidationError } from "./exceptions/ValidationError";

declare type JSONSchema7Definition = JSONSchema7 & {
  relation?: ModelName;
};

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
    formatter?: (item: Model<T>[P], context?: NextAdminContext) => ReactNode;
  };
};

export type EditFieldsOptions<T extends ModelName> = {
  [P in Field<T>]?: {
    validate?: (value: ModelWithoutRelationships<T>[P]) => true | string;
    format?: FormatOptions<ModelWithoutRelationships<T>[P]>;
    handler?: Handler<T, P, Model<T>[P]>;
    input?: React.ReactElement;
  } & (
    P extends keyof ObjectField<T> ? {
      optionFormatter?: (item: Model<T>[P] extends Array<infer U> ? U : Model<T>[P]) => string;
    } : {}
  )
};

export type Handler<
  M extends ModelName,
  P extends Field<M>,
  T extends Model<M>[P],
> = {
  get?: (input: T) => any;
  upload?: (file: Buffer) => Promise<string>;
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
  | "file"
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

export type ActionStyle = "default" | "destructive";

export type ModelAction = {
  title: string;
  action: (resource: ModelName, ids: string[] | number[]) => Promise<void>;
  style?: ActionStyle;
  successMessage?: string;
  errorMessage?: string;
};

export type ModelOptions<T extends ModelName> = {
  [P in T]?: {
    toString?: (item: Model<P>) => string;
    list?: ListOptions<P>;
    edit?: EditOptions<P>;
    title?: string;
    aliases?: Partial<Record<Field<P>, string>>;
    actions?: ModelAction[];
  };
};

export type NextAdminOptions = {
  basePath: string;
  model?: ModelOptions<ModelName>;
  pages?: Record<string, { title: string }>;
};

/** Type for Schema */

export type SchemaProperty<M extends ModelName> = {
  [P in Field<M>]?: JSONSchema7 & {
    items?: JSONSchema7Definition;
    relation?: ModelName
  };
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

export type AdminFormData<M extends ModelName> = {
  [P in Field<M>]?: string;
};

export type Body<F> = {
  [P in keyof F]?: string;
} & {
  [key: string]: string;
};

export type Order<M extends ModelName> = {
  [P in Field<M>]?: Prisma.SortOrder | { _count: Prisma.SortOrder };
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

export type ListDataFieldValueWithFormat = {
  __nextadmin_formatted: React.ReactNode;
};

export type ListDataFieldValue = ListDataFieldValueWithFormat &
  (
    | { type: "scalar"; value: string | number | boolean }
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
    }
  );

export type AdminComponentProps = {
  basePath: string;
  schema?: Schema;
  data?: ListData<ModelName>;
  resource?: ModelName;
  /**
   * Page router only
   */
  message?: {
    type: "success" | "info";
    content: string;
  };
  error?: string;
  validation?: PropertyValidationError[];
  resources?: ModelName[];
  total?: number;
  dmmfSchema?: Prisma.DMMF.Field[];
  isAppDir?: boolean;
  locale?: string;
  action?: (formData: FormData) => Promise<SubmitFormResult | undefined>;
  /**
   * Mandatory for page router
   */
  options?: NextAdminOptions;
  resourcesTitles?: Record<Prisma.ModelName, string | undefined>;
  customInputs?: Record<Field<ModelName>, React.ReactElement | undefined>;
  resourcesIdProperty?: Record<ModelName, string>;
  /**
   * App router only
   */
  pageComponent?: React.ComponentType;
  customPages?: Array<{ title: string; path: string }>;
  actions?: ModelAction[];
  deleteAction?: (model: ModelName, ids: string[] | number[]) => Promise<void>;
  translations?: Translations;
};

export type MainLayoutProps = Pick<
  AdminComponentProps,
  | "resource"
  | "resources"
  | "resourcesTitles"
  | "customPages"
  | "basePath"
  | "message"
  | "error"
  | "isAppDir"
  | "translations"
  | "locale"
>;

export type CustomUIProps = {
  dashboard?: JSX.Element | (() => JSX.Element);
};

export type ActionFullParams = ActionParams & {
  prisma: PrismaClient;
  options: NextAdminOptions;
};

export type ActionParams = {
  params?: string[];
  schema: any;
};

export type SubmitFormResult = {
  deleted?: boolean;
  created?: boolean;
  updated?: boolean;
  error?: string;
  createdId?: number;
  validation?: any;
};

export type NextAdminContext = {
  locale?: string;
};

export type CustomInputProps = Partial<{
  name: string;
  value: string;
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  readonly: boolean;
  rawErrors: string[];
}>;

export type TranslationKeys =
  | "list.header.add.label"
  | "list.header.search.placeholder"
  | "list.footer.indicator.showing"
  | "list.footer.indicator.to"
  | "list.footer.indicator.of"
  | "list.row.actions.delete.label"
  | "list.empty.label"
  | "form.button.save.label"
  | "form.button.delete.label"
  | "form.widgets.file_upload.label"
  | "form.widgets.file_upload.delete"
  | "actions.label"
  | "actions.delete.label";

export type Translations = {
  [key in TranslationKeys]?: string;
} & {
  [key: string]: string;
};
