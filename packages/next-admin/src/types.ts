import * as OutlineIcons from "@heroicons/react/24/outline";
import { Prisma, PrismaClient } from "@prisma/client";
import type { JSONSchema7 } from "json-schema";
import type { ChangeEvent, ReactNode } from "react";
import type { SearchPaginatedResourceParams } from "./actions";
import type { PropertyValidationError } from "./exceptions/ValidationError";

declare type JSONSchema7Definition = JSONSchema7 & {
  relation?: ModelName;
};

/** Type for Model */

export type ModelName = Prisma.ModelName;

export type ScalarField<T extends ModelName> =
  Prisma.TypeMap["model"][T]["payload"]["scalars"];
export type ObjectField<T extends ModelName> =
  Prisma.TypeMap["model"][T]["payload"]["objects"];

export type Payload = Prisma.TypeMap["model"][ModelName]["payload"];

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
> = Prisma.TypeMap["model"][M]["payload"]["objects"][P] extends Array<infer T>
  ? T
  : never | Prisma.TypeMap["model"][M]["payload"]["objects"][P] extends
        | infer T
        | null
    ? T
    : never | Prisma.TypeMap["model"][M]["payload"]["objects"][P];

export type ModelFromProperty<
  M extends ModelName,
  P extends keyof ObjectField<M>,
> = PropertyPayload<M, P> extends Payload
  ? ModelFromPayload<PropertyPayload<M, P>>
  : never;

export type ModelWithoutRelationships<M extends ModelName> = Model<M, number>;

export type NoticeField = {
  readonly id: string;
  title: string;
  description?: string;
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
  };
};

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
     * a React Element that should receive `CustomInputProps`](#custominputprops)`. For App Router, this element must be a client component.
     */
    input?: React.ReactElement;
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
  } & (P extends keyof ObjectField<T>
    ? {
        /**
         * only for relation fields, a function that takes the field values as a parameter and returns a string. Useful to display your record in related list.
         * @param item
         * @returns
         */
        optionFormatter?: (item: ModelFromProperty<T, P>) => string;
      }
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
   * @param file
   * @returns
   */
  upload?: (file: Buffer) => Promise<string>;
  /**
   * an optional string displayed in the input field as an error message in case of a failure during the upload handler.
   */
  uploadErrorMessage?: string;
};

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

export type ListOptions<T extends ModelName> = {
  /**
   * an array of fields that are displayed in the list.
   * @default all scalar
   */
  display?: Field<T>[];
  /**
   * an array of searchable fields.
   * @default all scalar
   */
  search?: Field<T>[];
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
};

export type EditOptions<T extends ModelName> = {
  /**
   * an array of fields that are displayed in the form. It can also be an object that will be displayed in the form of a notice.
   * @default all scalar
   */
  display?: Array<Field<T> | NoticeField>;
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
};

export type ActionStyle = "default" | "destructive";

export type ModelAction = {
  title: string;
  action: (resource: ModelName, ids: string[] | number[]) => Promise<void>;
  style?: ActionStyle;
  successMessage?: string;
  errorMessage?: string;
};

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
    aliases?: Partial<Record<Field<P>, string>>;
    actions?: ModelAction[];
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
   * `basePath` is a string that represents the base path of your admin. (e.g. `/admin`) - optional.
   */
  basePath: string;
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
  [P in Field<M>]?: JSONSchema7 & {
    items?: JSONSchema7Definition;
    relation?: ModelName;
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
  logoutUrl: string;
};

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
  resourcesIcons?: Record<Prisma.ModelName, ModelIcon>;
  customInputs?: Record<Field<ModelName>, React.ReactElement | undefined>;
  resourcesIdProperty?: Record<ModelName, string>;
  /**
   * App router only
   */
  pageComponent?: React.ComponentType;
  customPages?: Array<{ title: string; path: string; icon?: ModelIcon }>;
  actions?: ModelAction[];
  deleteAction?: (model: ModelName, ids: string[] | number[]) => Promise<void>;
  translations?: Translations;
  searchPaginatedResourceAction?: (
    params: SearchPaginatedResourceParams
  ) => Promise<{
    data: Enumeration[];
    total: number;
    error: string | null;
  }>;
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
  | "isAppDir"
  | "translations"
  | "locale"
  | "title"
  | "sidebar"
  | "resourcesIcons"
  | "user"
  | "externalLinks"
  | "options"
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
  redirect?: boolean;
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
  disabled: boolean;
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

export const colorSchemes = ["light", "dark", "system"] as const;
export type ColorScheme = (typeof colorSchemes)[number];
export type BasicColorScheme = Exclude<ColorScheme, "system">;
