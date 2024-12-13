import * as OutlineIcons from "@heroicons/react/24/outline";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import type { ChangeEvent, ReactNode } from "react";
import type { PropertyValidationError } from "./exceptions/ValidationError";
import type { NextAdminJSONSchema } from "@premieroctet/next-admin-json-schema";
import type React from "react";

declare type JSONSchema7Definition = NextAdminJSONSchema & {
  relation?: ModelName;
};

type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };
type ExtendsStringButIsNotString<T> = T extends string
  ? string extends T
    ? false
    : true
  : false;

/** Type for Model */

export type ModelName = Prisma.ModelName;
export type Payload = Prisma.TypeMap["model"][ModelName]["payload"];
export type ModelPayload<M extends ModelName> =
  Prisma.TypeMap["model"][M]["payload"];

export type ScalarField<T extends ModelName> = ModelPayload<T>["scalars"];
export type ObjectField<T extends ModelName> = ModelPayload<T>["objects"];
export type NonArrayObjectField<T extends ModelName> = OmitNever<{
  [K in keyof ModelPayload<T>["objects"]]: ModelPayload<T>["objects"][K] extends Array<any>
    ? never
    : ModelPayload<T>["objects"][K];
}>;

export type ModelFromPayload<
  P extends Payload,
  T extends object | number = object,
> = {
  [Property in keyof P["scalars"]]: P["scalars"][Property];
} & {
  [Property in keyof P["objects"]]: P["objects"][Property] extends {
    scalars: infer S;
  }
    ? T extends object
      ? S
      : T
    : never | P["objects"][Property] extends { scalars: infer S }[]
      ? T extends object
        ? S[]
        : T[]
      : never | P["objects"][Property] extends { scalars: infer S } | null
        ? T extends object
          ? S | null
          : T | null
        : never;
};

export type Model<
  M extends ModelName,
  T extends object | number = object,
> = ModelFromPayload<Prisma.TypeMap["model"][M]["payload"], T>;

export type PropertyPayload<
  M extends ModelName,
  P extends keyof ObjectField<M>,
> =
  Prisma.TypeMap["model"][M]["payload"]["objects"][P] extends Array<infer T>
    ? T
    : never | Prisma.TypeMap["model"][M]["payload"]["objects"][P] extends
          | infer T
          | null
      ? T
      : never | Prisma.TypeMap["model"][M]["payload"]["objects"][P];

export type ModelFromProperty<
  M extends ModelName,
  P extends keyof ObjectField<M>,
> =
  PropertyPayload<M, P> extends Payload
    ? ModelFromPayload<PropertyPayload<M, P>>
    : never;

export type ModelWithoutRelationships<M extends ModelName> = Model<M, number>;

export type NoticeField = {
  readonly id: string;
  title: string;
  description?: string;
};

type GreaterThan<
  A extends number,
  B extends number,
  S extends any[] = [],
> = S["length"] extends A
  ? false
  : S["length"] extends B
    ? true
    : GreaterThan<A, B, [...S, any]>;

type LessThan<
  A extends number,
  B extends number,
  S extends any[] = [],
> = S["length"] extends B
  ? false
  : S["length"] extends A
    ? true
    : LessThan<A, B, [...S, any]>;

type Substract<
  A extends number,
  B extends number,
  I extends any[] = [],
  O extends any[] = [],
> =
  LessThan<A, B> extends true
    ? never
    : LessThan<I["length"], A> extends true
      ? Substract<
          A,
          B,
          [...I, any],
          LessThan<I["length"], B> extends true ? O : [...O, any]
        >
      : O["length"];

type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never
        ? ""
        : `.${Leaves<Exclude<T[K], undefined>>}`}`;
    }[keyof T]
  : never;

export type NestableField<P extends Payload, S extends number = 4> = {
  [K in keyof P["scalars"]]: true;
} & {
  [K in keyof P["objects"]]: P["objects"][K] extends infer T | null
    ? T extends Payload
      ? GreaterThan<S, 0> extends true
        ? NestableField<T, Substract<S, 1>>
        : never
      : T extends Array<infer U>
        ? U extends Payload
          ? GreaterThan<S, 0> extends true
            ? NestableField<U, Substract<S, 1>>
            : never
          : never
        : never
    : never;
};

export type Field<P extends ModelName> = keyof Model<P>;

/** Type for Form */

/** Type for Options */

export type ListFieldsOptions<T extends ModelName> = {
  [P in Field<T>]?: {
    /**
     * a function that takes the field value as a parameter, and that return a JSX node. It also accepts a second argument which is the `NextAdmin` context.
     * @param item
     * @param context
     * @returns
     */
    formatter?: (
      item: P extends keyof ObjectField<T>
        ? ModelFromProperty<T, P>
        : Model<T>[P],
      context?: NextAdminContext
    ) => ReactNode;
  } & (P extends keyof NonArrayObjectField<T>
    ? {
        /**
         * The field to use for relationship sorting, defaults to the id field
         */
        sortBy?: keyof ModelFromProperty<T, P>;
      }
    : {});
};

export enum LogicalOperator {
  And = "AND",
  Or = "OR",
  Not = "NOT",
}

export type Filter<T extends ModelName> =
  Prisma.TypeMap["model"][T]["operations"]["findMany"]["args"]["where"];

export type FilterWrapper<T extends ModelName> = {
  /**
   * a string to identify filter, must be unique
   */
  name: string;
  /**
   * a boolean to set filter as default active on list page
   */
  active?: boolean;
  /**
   * a Prisma filter, equivalent to `where` clause in Prisma queries
   * @link https://www.prisma.io/docs/orm/reference/prisma-client-reference#filter-conditions-and-operators
   */
  value: Filter<T>;
  /**
   * An id that will be used to give filters with the same group name a radio like behavior
   */
  group?: string;
};

type RelationshipSearch<T> = {
  [S in keyof T]: {
    field: T[S] extends object ? S : never;
  };
}[keyof T];

type OptionFormatterFromRelationshipSearch<
  T extends ModelName,
  P extends keyof ObjectField<T>,
> = {
  [S in RelationshipSearch<ModelFromProperty<T, P>>["field"]]:
    | {
        /**
         * only for relation fields, a function that takes the field values as a parameter and returns a string. Useful to display your record in related list.
         * @param item
         * @returns
         */
        relationOptionFormatter?: (item: ModelFromProperty<T, P>[S]) => string;
        /**
         * model name on which to execute a research. Useful in case the field is related to an explicit many-to-many table
         */
        relationshipSearchField?: S;
      }
    | {
        /**
         * only for relation fields, a function that takes the field values as a parameter and returns a string. Useful to display your record in related list.
         * @param item
         * @returns
         */
        optionFormatter?: (item: ModelFromProperty<T, P>) => string;
      };
}[RelationshipSearch<ModelFromProperty<T, P>>["field"]];

export type EditFieldsOptions<T extends ModelName> = {
  [P in Field<T>]?: {
    /**
     * a function that takes the field value as a parameter, and that returns a boolean.
     * @param value
     * @returns
     */
    validate?: (value: ModelWithoutRelationships<T>[P]) => true | string;
    /**
     * a string defining an OpenAPI field format, overriding the one set in the generator. An extra `file` format can be used to be able to have a file input.
     */
    format?: FormatOptions<ModelWithoutRelationships<T>[P]>;
    /**
     * an object that can take the following properties.
     */
    handler?: Handler<T, P, Model<T>[P]>;
    /**
     * a React Element that should receive [`CustomInputProps`](#custominputprops). For App Router, this element must be a client component. Don't set any props, they will be passed automatically to the component.
     */
    input?: React.ReactElement<CustomInputProps>;
    /**
     * a helper text that is displayed underneath the input.
     */
    helperText?: string;
    /**
     * a tooltip content to show for the field.
     */
    tooltip?: string;
    /**
     * a boolean to indicate that the field is read only.
     */
    disabled?: boolean;
    /**
     * a true value to force a field to be required in the form, note that if the field is required by the Prisma schema, you cannot set `required` to false
     */
    required?: true;
    /**
     * a function that takes the field value as parameter and returns a boolean to determine if the field is displayed in the form.
     */
    visible?: (value: ModelWithoutRelationships<T>) => boolean;
  } & (P extends keyof ObjectField<T>
    ? OptionFormatterFromRelationshipSearch<T, P> &
        (
          | {
              /**
               * Property to indicate how to display the multi select widget :
               * - `list`: displayed as a list of elements that has a link and a delete button
               * - `table`: displayed as the table list for a resource. Requires to have display options configured for the related model
               * - `select`: displayed as a multi select dropdown
               *
               * @default "select"
               */
              display?: "table" | "select";
            }
          | { display?: "list"; orderField?: keyof ModelFromProperty<T, P> }
        )
    : P extends keyof ScalarField<T>
      ? ScalarField<T>[P] extends (infer Q)[]
        ? ExtendsStringButIsNotString<Q> extends true
          ? { display?: "list" | "select" }
          : {}
        : {}
      : {});
};

export type Handler<
  M extends ModelName,
  P extends Field<M>,
  T extends Model<M>[P],
> = {
  /**
   * a function that takes the field value as a parameter and returns a transformed value displayed in the form.
   * @param input
   * @returns
   */
  get?: (input: T) => any;
  /**
   * an async function that is used only for formats `file` and `data-url`. It takes a buffer as parameter and must return a string. Useful to upload a file to a remote provider.
   * @param buffer
   * @param infos
   * @param context - This object contains record information, such as the resource ID.
   * @returns
   */
  upload?: (
    buffer: Buffer,
    infos: {
      name: string;
      type: string | null;
    },
    context: {
      /**
       * the resource ID if it exists, otherwise undefined
       */
      resourceId: string | number | undefined;
    }
  ) => Promise<string>;
  /**
   * an optional string displayed in the input field as an error message in case of a failure during the upload handler.
   */
  uploadErrorMessage?: string;
};

export type UploadParameters = Parameters<
  (
    buffer: Buffer,
    infos: {
      name: string;
      type: string | null;
    }
  ) => Promise<string>
>;

export type RichTextFormat = "html" | "json";

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
      | "time-second"
      | "alt-datetime"
      | "alt-date"
      | "file"
      | `richtext-${RichTextFormat}`
      | "json"
  : never | T extends Date
    ? "date" | "date-time" | "time"
    : never | T extends number
      ? "updown" | "range"
      : never;

export type ListExport = {
  /**
   * a string defining the format of the export. It is mandatory.
   */
  format: string;
  /**
   * a string defining the URL of the export. It is mandatory.
   */
  url: string;
};

export type ListOptions<T extends ModelName> = {
  /**
   * an url to export the list data as CSV.
   */
  exports?: ListExport[] | ListExport;
  /**
   * an array of fields that are displayed in the list.
   * @default all scalar
   */
  display?: Field<T>[];
  /**
   * an array of searchable fields.
   * @default all scalar
   */
  search?: Leaves<NestableField<Prisma.TypeMap["model"][T]["payload"]>>[];
  /**
   * an array of fields that are copyable into the clipboard.
   * @default none
   */
  copy?: Field<T>[];
  /**
   * an object containing the model fields as keys, and customization values.
   */
  fields?: ListFieldsOptions<T>;
  /**
   * an optional object to determine the default sort to apply on the list.
   */
  defaultSort?: {
    /**
     * the model's field name on which the sort is applied. It is mandatory.
     */
    field: Field<T>;
    /**
     * the sort direction to apply. It is optional
     */
    direction?: Prisma.SortOrder;
  };
  /**
   * define a set of Prisma filters that user can choose in list
   */
  filters?: Array<FilterWrapper<T> | (() => Promise<FilterWrapper<T>[]>)>;
  /**
   * define a set of Prisma filters that are always active in list
   */
  where?: Filter<T>[];
};

export type SubmitResourceResponse =
  | {
      error: string;
      updated?: undefined;
      data?: undefined;
      redirect?: undefined;
      created?: undefined;
      createdId?: undefined;
      validation?: undefined;
    }
  | {
      error: string;
      updated?: undefined;
      data?: undefined;
      redirect?: undefined;
      created?: undefined;
      createdId?: undefined;
      validation: PropertyValidationError[];
    }
  | {
      error?: undefined;
      updated: true;
      data: any;
      redirect: boolean;
      created?: undefined;
      createdId?: undefined;
      validation?: undefined;
    }
  | {
      error?: undefined;
      updated?: undefined;
      data: any;
      redirect: boolean;
      created: true;
      createdId: any;
      validation?: undefined;
    };

export type EditModelHooks = {
  /**
   * a function that is called before the form data is sent to the database.
   *
   * @param data - the form data as a record
   * @param mode - the mode of the form, either "create" or "edit"
   * @param request - the request object. Note: on App Router, it will not be possible to call `formData` as the handler already calls it once
   * @returns the transformed form data record or a Response or NextApiResponse.
   * @throws HookError - if the hook fails, the status and message will be sent in the handler's response
   */
  beforeDb?: (
    data: Record<string, string | UploadParameters | null>,
    mode: "create" | "edit",
    request: NextRequest | NextApiRequest
  ) => Promise<Record<string, string | UploadParameters | null>>;
  /**
   * a function that is called after the form submission. It takes the response of the db insertion as a parameter.
   * @param data
   */
  afterDb?: (
    data: SubmitResourceResponse,
    mode: "create" | "edit",
    request: NextRequest | NextApiRequest
  ) => Promise<SubmitResourceResponse>;
};

export type EditOptions<T extends ModelName> = {
  /**
   * an array of fields that are displayed in the form. It can also be an object that will be displayed in the form of a notice.
   * @default all scalar
   */
  display?: Array<Field<T> | NoticeField | (string & {})>;
  /**
   * an object containing the styles of the form.
   */
  styles?: {
    /**
     * a string defining the classname of the form.
     */
    _form?: string;
  } & Partial<
    {
      [Key in Field<T>]: string;
    } & Record<string, string>
  >;
  /**
   * an object containing the model fields as keys, and customization values.
   */
  fields?: EditFieldsOptions<T>;
  /**
   * a message displayed if an error occurs during the form submission, after the form validation and before any call to prisma.
   */
  submissionErrorMessage?: string;
  /**
   * a set of hooks to call before and after the form data insertion into the database.
   */
  hooks?: EditModelHooks;
  customFields?: CustomFieldsType;
};

type CustomFieldsType = {
  [key: string]: {
    input?: React.ReactElement<CustomInputProps>;
    tooltip?: string;
    format?: FormatOptions<any>;
    helperText?: string;
    required?: boolean;
  };
};

export type ActionStyle = "default" | "destructive";

export type MessageData = {
  type: "error" | "info" | "success";
  message: string;
};

export type MessageContextType = {
  showMessage: (message: MessageData) => void;
  message: MessageData | null;
  hideMessage: () => void;
};

export type BareModelAction<M extends ModelName> = {
  title: string;
  id: string;
  canExecute?: (item: Model<M>) => boolean;
  icon?: keyof typeof OutlineIcons;
  style?: ActionStyle;
  /**
   * Max depth of the related records to select
   *
   * @default 2
   */
  depth?: number;
};

export type ServerAction = {
  type: "server";
  action: (ids: string[] | number[]) => Promise<void | MessageData>;
  successMessage?: string;
  errorMessage?: string;
} & BareModelAction<ModelName>;

export type ClientAction<T extends ModelName> = {
  type: "dialog";
  component: React.ReactElement<ClientActionDialogContentProps<T>>;
  /**
   * Class name to apply to the dialog content
   */
  className?: string;
} & BareModelAction<T>;

export type ModelAction<T extends ModelName> = ServerAction | ClientAction<T>;

export type UnionModelAction = {
  [M in ModelName]: ModelAction<M>;
}[ModelName];

export type OutputModelAction = (Omit<
  UnionModelAction,
  "action" | "canExecute"
> & {
  allowedIds?: string[] | number[];
})[];

export type ModelIcon = keyof typeof OutlineIcons;

export enum Permission {
  CREATE = "create",
  EDIT = "edit",
  DELETE = "delete",
}

export type PermissionType = "create" | "edit" | "delete";

export type ModelOptions<T extends ModelName> = {
  [P in T]?: {
    /**
     * a function that is used to display your record in related list.
     * @default "id"
     */
    toString?: (item: Model<P>) => string;
    /**
     * define list options for this model.
     */
    list?: ListOptions<P>;
    /**
     * define edit options for this model.
     */
    edit?: EditOptions<P>;
    /**
     * a string used to display the model name in the sidebar and in the section title.
     */
    title?: string;
    /**
     * an object containing the aliases of the model fields as keys, and the field name.
     */
    aliases?: Partial<Record<Field<P>, string>> & { [key: string]: string };
    actions?: ModelAction<P>[];
    /**
     * the outline HeroIcon name displayed in the sidebar and pages title
     * @type ModelIcon
     * @link https://heroicons.com/outline
     */
    icon?: ModelIcon;
    permissions?: PermissionType[];
  };
};

export type SidebarGroup = {
  /**
   * Some optional css classes to improve appearance of group title.
   */
  className?: string;
  /**
   * the name of the group.
   */
  title: string;
  /**
   * the model names to display in the group.
   */
  models: ModelName[];
};

export type SidebarConfiguration = {
  /**
   * an array of objects that creates groups for specific resources.
   */
  groups: SidebarGroup[];
};

export type ExternalLink = {
  /**
   * the label of the link displayed on the sidebar. This is mandatory.
   */
  label: string;
  /**
   * the URL of the link. This is mandatory.
   */
  url: string;
};

export type NextAdminOptions = {
  /**
   * Global admin title
   *
   * @default "Admin"
   */
  title?: string;
  /**
   * `model` is an object that represents the customization options for each model in your schema.
   */
  model?: ModelOptions<ModelName>;
  /**
   * `pages` is an object that allows you to add your own sub pages as a sidebar menu entry.
   */
  pages?: Record<
    string,
    {
      /**
       * the title of the page displayed on the sidebar.
       */
      title: string;
      /**
       * the outline HeroIcon name displayed in the sidebar and pages title
       * @type ModelIcon
       * @link https://heroicons.com/outline
       */
      icon?: ModelIcon;
    }
  >;
  /**
   * The `sidebar` property allows you to customise the aspect of the sidebar menu.
   */
  sidebar?: SidebarConfiguration;
  /**
   * The `externalLinks` property allows you to add external links to the sidebar menu.
   */
  externalLinks?: ExternalLink[];
  /**
   * The `forceColorScheme` property defines a default color palette between `light`, `dark` and `system`, don't allows the user to modify it.
   * @default 'system'
   */
  forceColorScheme?: ColorScheme;
  /**
   * The `defaultColorScheme` property defines a default color palette between `light`, `dark` and `system`, but allows the user to modify it.
   * @default 'system'
   */
  defaultColorScheme?: ColorScheme;
};

/** Type for Schema */

export type SchemaProperty<M extends ModelName> = {
  [P in Field<M>]?: NextAdminJSONSchema & {
    items?: JSONSchema7Definition;
    relation?: ModelName;
  };
};

export type SchemaModel<M extends ModelName> = Partial<
  Omit<NextAdminJSONSchema, "properties">
> & {
  properties: SchemaProperty<M>;
};

export type SchemaDefinitions = {
  [M in ModelName]: SchemaModel<M>;
};

export type Schema = Partial<Omit<NextAdminJSONSchema, "definitions">> & {
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
  [P in Field<M>]?:
    | Prisma.SortOrder
    | { _count: Prisma.SortOrder }
    | { [key: string]: Prisma.SortOrder };
};

export type Select<M extends ModelName> = {
  [P in Field<M>]?: boolean;
} & {
  _count?: {
    select: {
      [key in string]: boolean;
    };
  };
};

export type Enumeration = {
  label: string;
  value: string;
  data?: any;
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

export type UserData = {
  name: string;
  picture?: string;
};

export type AdminUser = {
  data: UserData;
  logout?: [RequestInfo, RequestInit?] | (() => void | Promise<void>) | string;
};

export type AdminComponentProps = {
  basePath: string;
  apiBasePath: string;
  schema: Schema;
  data?: ListData<ModelName>;
  resource?: ModelName | null;
  slug?: string;
  /**
   * Page router only
   */
  message?: {
    type: "success" | "info";
    content: string;
  };
  error?: string | null;
  validation?: PropertyValidationError[];
  resources?: ModelName[];
  total?: number;
  isAppDir?: boolean;
  locale?: string | null;
  /**
   * Mandatory for page router
   */
  options?: NextAdminOptions;
  resourcesTitles?: Record<Prisma.ModelName, string | undefined>;
  resourcesIcons?: Record<Prisma.ModelName, ModelIcon>;
  customInputs?: Record<
    Field<ModelName>,
    React.ReactElement<CustomInputProps> | undefined
  > | null;
  resourcesIdProperty?: Record<ModelName, string>;
  /**
   * App router only
   */
  pageComponent?: React.ComponentType;
  customPages?: Array<{ title: string; path: string; icon?: ModelIcon }>;
  actions?: OutputModelAction;
  translations?: Translations;
  /**
   * Global admin title
   *
   * @default "Admin"
   */
  title?: string;
  sidebar?: SidebarConfiguration;
  user?: AdminUser;
  externalLinks?: ExternalLink[];
};

export type MainLayoutProps = Pick<
  AdminComponentProps,
  | "resource"
  | "resources"
  | "resourcesTitles"
  | "customPages"
  | "basePath"
  | "apiBasePath"
  | "isAppDir"
  | "translations"
  | "locale"
  | "title"
  | "sidebar"
  | "resourcesIcons"
  | "user"
  | "externalLinks"
  | "options"
  | "resourcesIdProperty"
  | "schema"
>;

export type CustomUIProps = {
  dashboard?: React.JSX.Element | (() => React.JSX.Element);
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
  redirect?: boolean;
  error?: string;
  createdId?: number;
  validation?: any;
};

export type NextAdminContext = {
  locale?: string | null;
  row?: any;
};

export type CustomInputProps = Partial<{
  name: string;
  value: string;
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  readonly: boolean;
  rawErrors: string[];
  disabled: boolean;
  required?: boolean;
  mode: "create" | "edit";
}>;

export type TranslationKeys =
  | "actions.delete.label"
  | "actions.label"
  | "export.label"
  | "actions.create.label"
  | "actions.edit.label"
  | "form.button.delete.label"
  | "form.delete.alert"
  | "form.button.save.label"
  | "form.button.save_edit.label"
  | "list.empty.label"
  | "list.empty.caption"
  | "list.footer.indicator.showing"
  | "list.footer.indicator.to"
  | "list.footer.indicator.of"
  | "list.header.add.label"
  | "list.header.search.placeholder"
  | "list.header.result"
  | "list.header.search.result"
  | "list.header.search.result_filtered"
  | "list.row.actions.delete.label"
  | "list.row.actions.delete.alert"
  | "list.row.actions.delete.success"
  | "list.row.actions.delete.error"
  | "list.row.actions.export"
  | "form.widgets.file_upload.label"
  | "form.widgets.file_upload.drag_and_drop"
  | "form.widgets.file_upload.delete"
  | "form.widgets.multiselect.select"
  | "form.widgets.scalar_array.add"
  | "selector.loading"
  | "theme.dark"
  | "theme.light"
  | "theme.system"
  | "user.logout"
  | "search.advanced.title"
  | "search.advanced.add"
  | "search.advanced.clear"
  | "search.advanced.cancel"
  | "search.advanced.save"
  | "search.advanced.and_or_group"
  | "search.advanced.conditions.equals"
  | "search.advanced.conditions.not"
  | "search.advanced.conditions.in"
  | "search.advanced.conditions.notIn"
  | "search.advanced.conditions.lt"
  | "search.advanced.conditions.lte"
  | "search.advanced.conditions.gt"
  | "search.advanced.conditions.gte"
  | "search.advanced.conditions.contains"
  | "search.advanced.conditions.search"
  | "search.advanced.conditions.startsWith"
  | "search.advanced.conditions.endsWith"
  | "search.advanced.conditions.null"
  | "search.advanced.conditions.nnull";

export type Translations = {
  [key in TranslationKeys]?: string;
} & {
  [key: string]: string;
};

export const colorSchemes = ["light", "dark", "system"];
export type ColorScheme = (typeof colorSchemes)[number];
export type BasicColorScheme = Exclude<ColorScheme, "system">;

export type PageProps = {
  params: { [key: string]: string[] | string };
  searchParams: { [key: string]: string | string[] | undefined } | undefined;
};

export type PromisePageProps = {
  [key in keyof PageProps]: Promise<PageProps[key]>;
};

export type GetNextAdminPropsParams = {
  /**
   * `params` is an array of strings that represents the dynamic segments of your route. (e.g. `[[...params]]`)
   */
  params?: string | string[];
  /**
   * `searchParams` is an object that represents the query parameters of your route. (e.g. `?key=value`)
   */
  searchParams: { [key: string]: string | string[] | undefined } | undefined;
  /**
   * `basePath` is a string that represents the base path of your admin. (e.g. `/admin`)
   */
  basePath: string;
  /**
   * `apiBasePath` is a string that represents the base path of the admin API route. (e.g. `/api/admin`)
   */
  apiBasePath: string;
  /**
   * `options` is an object that represents the options of your admin.
   *  @link https://next-admin.js.org/docs/api-docs#next-admin-options
   */
  options?: NextAdminOptions;
  /**
   * `prisma` is an instance of PrismaClient.
   */
  prisma: PrismaClient;
  isAppDir?: boolean;
  /**
   * `locale` is a string that represents the locale of your admin. (e.g. `en`)
   */
  locale?: string;
  /**
   * `getMessages` is a function that returns a promise of an object that represents the translations of your admin.
   * @param locale
   * @returns
   */
  getMessages?: (locale: string) => Promise<Record<string, string>>;
};

export type GetMainLayoutPropsParams = Omit<
  GetNextAdminPropsParams,
  "schema" | "searchParams" | "prisma"
>;

export type RequestContext<P extends string> = {
  params: Promise<Record<P, string[]>>;
};

export type CreateAppHandlerParams<P extends string = "nextadmin"> = {
  /**
   * `apiBasePath` is a string that represents the base path of the admin API route. (e.g. `/api`) - optional.
   */
  apiBasePath: string;
  /**
   * Next-admin options
   */
  options?: NextAdminOptions;
  /**
   * Prisma client instance
   */
  prisma: PrismaClient;
  /**
   * A function that acts as a middleware. Useful to add authentication logic for example.
   */
  onRequest?: (
    req: NextRequest,
    ctx: RequestContext<P>
  ) =>
    | ReturnType<NextResponse["json"]>
    | ReturnType<NextResponse["text"]>
    | Promise<void>;
  /**
   * A string indicating the name of the dynamic segment.
   *
   * Example:
   * - If the dynamic segment is `[[...nextadmin]]`, then the `paramKey` should be `nextadmin`.
   * - If the dynamic segment is `[[...admin]]`, then the `paramKey` should be `admin`.
   *
   * @default "nextadmin"
   */
  paramKey?: P;
};

export type FormProps = {
  data: any;
  schema: SchemaDefinitions[ModelName];
  resource: ModelName;
  slug?: string;
  validation?: PropertyValidationError[];
  title: string;
  customInputs?: Record<
    Field<ModelName>,
    React.ReactElement<CustomInputProps> | undefined
  > | null;
  actions?: AdminComponentProps["actions"];
  icon?: ModelIcon;
  resourcesIdProperty: Record<ModelName, string>;
};

export type ClientActionDialogContentProps<T extends ModelName> = Partial<{
  resource: ModelName;
  resourceIds: Array<string | number>;
  data: Array<Model<T>>;
  onClose: (message?: MessageData) => void;
}>;
