import { Prisma, PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import util from "util";
import {
  EditFieldsOptions,
  EditOptions,
  Enumeration,
  Field,
  FormData,
  ListOptions,
  ModelName,
  ModelWithoutRelationships,
  NextAdminOptions,
  ScalarField,
  Schema,
} from "../types";
import { createWherePredicate } from "./prisma";
import { isNativeFunction, uncapitalize } from "./tools";
import { IncomingMessage } from "http";
import formidable from "formidable";
import { Writable } from "stream";

export const models = Prisma.dmmf.datamodel.models;
export const resources = models.map((model) => model.name as ModelName);

export const getPrismaModelForResource = (resource: ModelName) =>
  models.find((datamodel) => datamodel.name === resource);

export const getResources = (
  options?: NextAdminOptions
): Prisma.ModelName[] => {
  const definedModels =
    options && options.model
      ? (Object.keys(options.model) as Prisma.ModelName[])
      : [];
  return definedModels.length > 0 ? definedModels : resources;
};

/**
 * Fill fields with relations with the values of the related model, and inject them into the schema
 *
 * @param schema
 * @param prisma
 * @param requestOptions
 * @param options
 */
export const fillRelationInSchema = async (
  schema: Schema,
  prisma: PrismaClient,
  resource: ModelName,
  requestOptions: any,
  options?: NextAdminOptions
) => {
  const modelName = resource;
  const model = models.find((model) => model.name === modelName);
  if (!model) return schema;
  await Promise.all(
    model.fields.map(async (field) => {
      const fieldName = field.name as Field<typeof modelName>;
      const fieldType = field.type;
      const fieldKind = field.kind;
      const relationFromFields = field.relationFromFields;
      const relationToFields = field.relationToFields;
      if (fieldKind === "enum") {
        const fieldValue =
          schema.definitions[modelName].properties[
            field.name as Field<typeof modelName>
          ];
        if (fieldValue) {
          fieldValue.enum = fieldValue.enum?.map((item) =>
            typeof item !== "object" ? { label: item, value: item } : item
          );
        }
      }
      if (fieldKind === "object") {
        const modelNameRelation = fieldType as ModelName;
        const remoteModel = models.find(
          (model) => model.name === modelNameRelation
        );
        const listOptions = options?.model?.[modelNameRelation]
          ?.list as ListOptions<typeof modelNameRelation>;
        const optionsForRelations =
          listOptions?.search ?? remoteModel?.fields.map((field) => field.name);
        const relationProperty: Field<typeof modelName> =
          (relationFromFields?.[0] as Field<typeof modelName>) ?? fieldName;
        const fieldsFiltered = remoteModel?.fields.filter(
          (field) => (optionsForRelations as string[])?.includes(field.name)
        );
        const search = requestOptions[`${relationProperty}search`];
        const where = createWherePredicate(fieldsFiltered, search);
        const nonChekedToString = options?.model?.[modelNameRelation]?.toString;
        const toStringForRelations =
          nonChekedToString && !isNativeFunction(nonChekedToString)
            ? nonChekedToString
            : (item: any) => item[relationToFields?.[0]] ?? item.id;
        if (
          relationFromFields &&
          relationFromFields.length > 0 &&
          relationToFields!.length > 0
        ) {
          //Relation One-to-Many, Many side
          const relationRemoteProperty = relationToFields![0];
          let enumeration: Enumeration[] = [];
          await prisma[uncapitalize(modelNameRelation)]
            // @ts-expect-error
            .findMany({
              where,
            })
            .then((data: any[]) =>
              data.forEach((item) => {
                enumeration.push({
                  label: toStringForRelations(item),
                  value: item[relationRemoteProperty],
                });
              })
            );
          schema.definitions[modelName].properties[relationProperty] = {
            type: "string",
            enum: enumeration,
          };
          delete schema.definitions[modelName].properties[fieldName];
        } else {
          const fieldValue =
            schema.definitions[modelName].properties[
              field.name as Field<typeof modelName>
            ];
          if (fieldValue) {
            let enumeration: Enumeration[] = [];
            await prisma[uncapitalize(modelNameRelation)]
              // @ts-expect-error
              .findMany({
                where,
              })
              .then((data: any[]) =>
                data.forEach((item) => {
                  enumeration.push({
                    label: toStringForRelations(item),
                    value: item.id,
                  });
                })
              );

            if (fieldValue.type === "array") {
              //Relation One-to-Many, One side
              fieldValue.items = {
                type: "string",
                enum: enumeration,
              };
            } else {
              //Relation One-to-One
              fieldValue.type = "string";
              fieldValue.enum = enumeration;
              delete fieldValue.anyOf;
            }
          }
        }
      }
    })
  );
  return schema;
};

/**
 * This is used to transform the data from server to client
 */
export const transformData = <M extends ModelName>(
  data: any,
  resource: M,
  editOptions: EditOptions<M>
) => {
  const modelName = resource;
  const model = models.find((model) => model.name === modelName);
  if (!model) return data;

  return Object.keys(data).reduce((acc, key) => {
    const field = model.fields.find((field) => field.name === key);
    const fieldKind = field?.kind;
    const get = editOptions?.fields?.[key as Field<M>]?.handler?.get;
    if (get) {
      acc[key] = get(data[key]);
    } else {
      if (fieldKind === "object") {
        // Flat relationships to id
        if (Array.isArray(data[key])) {
          acc[key] = data[key].map((item: any) => item.id);
        } else {
          acc[key] = data[key] ? data[key].id : null;
        }
      } else {
        const fieldTypes = field?.type;
        if (fieldTypes === "DateTime") {
          acc[key] = data[key] ? data[key].toISOString() : null;
        } else {
          acc[key] = data[key] ? data[key] : null;
        }
      }
    }
    return acc;
  }, {} as any);
};

/**
 * Fill fields in data with the their values and url for the related model
 *
 * @param data
 * @param dmmfSchema
 *
 * @returns data
 * */
export const findRelationInData = async (
  data: any[],
  dmmfSchema?: Prisma.DMMF.Field[]
) => {
  dmmfSchema?.forEach((dmmfProperty) => {
    const dmmfPropertyName = dmmfProperty.name;
    const dmmfPropertyType = dmmfProperty.type;
    const dmmfPropertyKind = dmmfProperty.kind;
    const dmmfPropertyRelationFromFields = dmmfProperty.relationFromFields;
    const dmmfPropertyRelationToFields = dmmfProperty.relationToFields;

    if (dmmfPropertyKind === "object") {
      if (
        dmmfPropertyRelationFromFields!.length > 0 &&
        dmmfPropertyRelationToFields!.length > 0
      ) {
        data.map((item) => {
          if (item[dmmfPropertyName]) {
            item[dmmfPropertyName] = {
              type: "link",
              value: {
                label: item[dmmfPropertyName],
                url: `${dmmfProperty.type as ModelName}/${
                  item[dmmfPropertyName]["id"]
                }`,
              },
            };
          } else {
            return item;
          }
        });
      } else {
        data.map((item) => {
          if (item._count) {
            Object.keys(item._count).forEach((key) => {
              item[key] = { type: "count", value: item._count[key] };
            });
            delete item._count;
          }
        });
      }
    }

    if (dmmfPropertyType === "DateTime") {
      data.map((item) => {
        if (item[dmmfProperty.name]) {
          item[dmmfProperty.name] = {
            type: "date",
            value: item[dmmfProperty.name].toISOString(),
          };
        } else {
          return item;
        }
      });
    }
  });
  return data;
};

export const parseFormData = <M extends ModelName>(
  formData: FormData<M>,
  dmmfSchema: Prisma.DMMF.Field[]
): Partial<ModelWithoutRelationships<M>> => {
  const parsedData: Partial<ModelWithoutRelationships<M>> = {};
  dmmfSchema.forEach((dmmfProperty) => {
    if (dmmfProperty.name in formData) {
      const dmmfPropertyName = dmmfProperty.name as keyof ScalarField<M>;
      const dmmfPropertyType = dmmfProperty.type;
      const dmmfPropertyKind = dmmfProperty.kind;
      if (dmmfPropertyKind === "object") {
        if (Boolean(formData[dmmfPropertyName])) {
          parsedData[dmmfPropertyName] = JSON.parse(
            formData[dmmfPropertyName] as string
          ) as ModelWithoutRelationships<M>[typeof dmmfPropertyName];
        } else {
          parsedData[dmmfPropertyName] =
            null as ModelWithoutRelationships<M>[typeof dmmfPropertyName];
        }
      } else if (dmmfPropertyType === "Int") {
        const value = Number(formData[dmmfPropertyName]) as number;
        parsedData[dmmfPropertyName] = isNaN(value)
          ? undefined
          : (value as ModelWithoutRelationships<M>[typeof dmmfPropertyName]);
      } else if (dmmfPropertyType === "Boolean") {
        parsedData[dmmfPropertyName] = (formData[dmmfPropertyName] ===
          "on") as unknown as ModelWithoutRelationships<M>[typeof dmmfPropertyName];
      } else if (dmmfPropertyType === "DateTime") {
        parsedData[dmmfPropertyName] = formData[
          dmmfPropertyName
        ] as unknown as ModelWithoutRelationships<M>[typeof dmmfPropertyName];
      } else {
        parsedData[dmmfPropertyName] = formData[
          dmmfPropertyName
        ] as unknown as ModelWithoutRelationships<M>[typeof dmmfPropertyName];
      }
    }
  });
  return parsedData;
};

/**
 * Convert the form data to the format expected by Prisma
 *
 * @param formData
 * @param dmmfSchema
 *
 */
export const formattedFormData = async <M extends ModelName>(
  formData: FormData<M>,
  dmmfSchema: Prisma.DMMF.Field[],
  schema: Schema,
  resource: M,
  creating: boolean,
  editOptions?: EditFieldsOptions<M>
) => {
  const formattedData: any = {};
  const modelName = resource;
  await Promise.allSettled(
    dmmfSchema.map(async (dmmfProperty) => {
      if (dmmfProperty.name in formData) {
        const dmmfPropertyName = dmmfProperty.name as Field<M>;
        const dmmfPropertyType = dmmfProperty.type;
        const dmmfPropertyKind = dmmfProperty.kind;
        if (dmmfPropertyKind === "object") {
          const dmmfPropertyTypeTyped = dmmfPropertyType as Prisma.ModelName;
          const fieldValue =
            schema.definitions[modelName].properties[
              dmmfPropertyName as Field<typeof dmmfPropertyTypeTyped>
            ];
          const model = models.find((model) => model.name === dmmfPropertyType);
          const formatId = (value?: string) =>
            model?.fields.find((field) => field.name === "id")?.type === "Int"
              ? Number(value)
              : value;
          if (fieldValue?.type === "array") {
            formData[dmmfPropertyName] = JSON.parse(
              formData[dmmfPropertyName]!
            );
            formattedData[dmmfPropertyName] = {
              // @ts-expect-error
              [creating ? "connect" : "set"]: formData[dmmfPropertyName].map(
                (item: any) => ({ id: formatId(item) })
              ),
            };
          } else {
            const connect = Boolean(formData[dmmfPropertyName]);
            if (!creating)
              formattedData[dmmfPropertyName] = connect
                ? { connect: { id: formatId(formData[dmmfPropertyName]) } }
                : { disconnect: true };
          }
        } else {
          if (dmmfPropertyType === "Int") {
            formattedData[dmmfPropertyName] = !isNaN(
              Number(formData[dmmfPropertyName])
            )
              ? Number(formData[dmmfPropertyName])
              : undefined;
          } else if (dmmfPropertyType === "Boolean") {
            formattedData[dmmfPropertyName] =
              formData[dmmfPropertyName] === "on";
          } else if (dmmfPropertyType === "DateTime") {
            formattedData[dmmfPropertyName] = formData[dmmfPropertyName]
              ? new Date(formData[dmmfPropertyName]!)
              : null;
          } else if (
            dmmfPropertyType === "String" &&
            ["data-url", "file"].includes(
              editOptions?.[dmmfPropertyName]?.format ?? ""
            ) &&
            formData[dmmfPropertyName] instanceof Buffer
          ) {
            const uploadHandler =
              editOptions?.[dmmfPropertyName]?.handler?.upload;

            if (!uploadHandler) {
              console.warn(
                "You need to provide an upload handler for data-url format"
              );
            } else {
              const uploadResult = await uploadHandler(
                formData[dmmfPropertyName] as unknown as Buffer
              );
              if (typeof uploadResult !== "string") {
                console.warn(
                  "Upload handler must return a string, fallback to no-op for field " +
                    dmmfPropertyName.toString()
                );
              } else {
                formattedData[dmmfPropertyName] = uploadResult;
              }
            }
          } else {
            formattedData[dmmfPropertyName] = formData[dmmfPropertyName];
          }
        }
      }
    })
  );

  return formattedData;
};

/**
 * Convert the search fields to the format expected by Prisma
 *
 *
 * @param uri
 * @returns
 *
 * @example
 *
 * ```js
 * const uri = "search=foo&searchFields=bar&searchFields=baz";
 * const searchFields = formatSearchFields(uri);
 * console.log(searchFields);
 * // { search: 'foo', searchFields: [ 'bar', 'baz' ] }
 * ```
 *
 */
export const formatSearchFields = (uri: string) =>
  Object.fromEntries(new URLSearchParams(uri));

export const transformSchema = <M extends ModelName>(
  schema: Schema,
  resource: M,
  editOptions: EditOptions<M>
) => {
  schema = removeHiddenProperties(schema, resource, editOptions);
  schema = changeFormatInSchema(schema, resource, editOptions);
  return schema;
};

export const changeFormatInSchema = <M extends ModelName>(
  schema: Schema,
  resource: M,
  editOptions: EditOptions<M>
) => {
  const modelName = resource;
  const model = models.find((model) => model.name === modelName);
  if (!model) return schema;
  model.fields.forEach((dmmfProperty) => {
    const dmmfPropertyName = dmmfProperty.name as Field<typeof modelName>;
    if (editOptions?.fields?.[dmmfPropertyName]?.format) {
      const fieldValue =
        schema.definitions[modelName].properties[
          dmmfPropertyName as Field<typeof modelName>
        ];
      if (fieldValue) {
        if (editOptions?.fields?.[dmmfPropertyName]?.format === "file") {
          fieldValue.format = "data-url";
        } else {
          fieldValue.format = editOptions?.fields?.[dmmfPropertyName]?.format;
        }
      }
    }
  });
  return schema;
};

export const removeHiddenProperties = <M extends ModelName>(
  schema: Schema,
  resource: M,
  editOptions: EditOptions<M>
) => {
  if (!editOptions) return schema;
  const properties = schema.definitions[resource].properties;
  Object.keys(properties).forEach((property) => {
    if (!editOptions.display?.includes(property as Field<M>)) {
      delete properties[property as Field<M>];
    }
  });
  return schema;
};

// TODO Add test
export const getResourceFromUrl = (
  url: string,
  resources: Prisma.ModelName[]
): ModelName | undefined => {
  return resources.find((r) => url.includes(`/${r}`));
};

export const getResourceFromParams = (
  params: string[],
  resources: Prisma.ModelName[]
) => {
  return resources.find((r) => params.includes(r));
};

// TODO Add test
export const getResourceIdFromUrl = (
  url: string,
  resource: ModelName
): string | number | undefined => {
  const matching = url.match(`/${resource}/([0-9a-z-]+)`);

  if (!matching) return undefined;
  if (matching[1] === "new") return undefined;

  const model = models.find((model) => model.name === resource);

  const idType = model?.fields.find((field) => field.name === "id")?.type;

  if (idType === "Int") {
    return Number(matching[1]);
  }

  return matching ? matching[1] : undefined;
};

export const getFormDataValues = async (req: IncomingMessage) => {
  const form = formidable({
    allowEmptyFiles: true,
    minFileSize: 0,
    fileWriteStreamHandler: () => {
      return new Writable({
        write(_chunk, _encoding, callback) {
          callback();
        },
      });
    },
  });
  return new Promise<Record<string, string | Buffer | null>>(
    (resolve, reject) => {
      const files = {} as Record<string, Buffer[] | [null]>;

      form.on("fileBegin", (name, file) => {
        // @ts-expect-error
        file.createFileWriteStream = () => {
          const chunks = [] as Buffer[];
          return new Writable({
            write(chunk, _encoding, callback) {
              chunks.push(chunk);
              callback();
            },
            final(callback) {
              if (!file.originalFilename) {
                files[name] = [null];
              } else {
                files[name] = [Buffer.concat(chunks)];
              }
              callback();
            },
          });
        };
      });

      form.parse(req, (err, fields) => {
        if (err) {
          reject(err);
        }
        const joinedFormData = Object.entries({ ...fields, ...files }).reduce(
          (acc, [key, value]) => {
            if (Array.isArray(value)) {
              acc[key] = value[0];
            }
            return acc;
          },
          {} as Record<string, string | Buffer | null>
        );
        resolve(joinedFormData);
      });
    }
  );
};
