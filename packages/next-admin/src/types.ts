import { Prisma } from "@prisma/client";
import { JSONSchema7 } from "json-schema";
import { ReactNode } from "react";
import { PropertyValidationError } from "./exceptions/ValidationError";

/** Type for Model */

export type ModelName = Prisma.ModelName;

export type ScalarField<T extends ModelName> = Prisma.TypeMap["model"][T]["payload"]["scalars"];
export type ObjectField<T extends ModelName> = Prisma.TypeMap["model"][T]["payload"]["objects"];

export type Model<T extends ModelName> = ScalarField<T> & {
  [P in keyof ObjectField<T>]:
  ObjectField<T>[P] extends { scalars: infer S } ? S
  : ObjectField<T>[P] extends { scalars: infer S } | null ? S | null
  : ObjectField<T>[P] extends { scalars: infer S }[] ? S[]
  : never;
}

export type Field<P extends ModelName> = keyof Model<P>;

/** Type for Options */

export type ListFieldsOptions<T extends ModelName> = {
  [P in Field<T>]?: {
    display?: true;
    search?: true;
  };
};

export type EditFieldsOptions<T extends ModelName> = {
  [P in Field<T>]?: {
    display?: boolean;
    validate?: (value: Model<T>[P]) => true | string;
  };
};

export type ModelOptions<T extends ModelName> = {
  [P in T]?: {
    toString?: (item: Model<P>) => string;
    list?: {
      fields: ListFieldsOptions<P>;
    };
    edit?: {
      fields: EditFieldsOptions<P>;
    };
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

export type ListComponentFieldsOptions<T extends ModelName> = {
  [P in Field<T>]?: {
    formatter?: (item: ListDataItem<ModelName>) => ReactNode;
  };
};

export type AdminComponentOptions<T extends ModelName> = {
  model?: {
    [P in T]?: {
      toString?: (item: Model<P>) => string;
      list?: {
        fields: ListComponentFieldsOptions<P>;
      };
    };
  };
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
  options?: AdminComponentOptions<ModelName>;
};

export type CustomUIProps = {
  dashboard?: JSX.Element | (() => JSX.Element);
};