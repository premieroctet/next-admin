import { Prisma } from "@prisma/client";
import formidable from "formidable";
import { IncomingMessage } from "http";
import { Writable } from "stream";
import {
  AdminFormData,
  EditFieldsOptions,
  EditOptions,
  Enumeration,
  Field,
  ModelName,
  ModelWithoutRelationships,
  NextAdminOptions,
  ObjectField,
  ScalarField,
  Schema,
} from "../types";
import { isNativeFunction, pipe } from "./tools";

export const models = Prisma.dmmf.datamodel.models;
export const enums = Prisma.dmmf.datamodel.enums;
export const resources = models.map((model) => model.name as ModelName);

export const getEnumValues = (enumName: string) => {
  const enumValues = enums.find((en) => en.name === enumName);
  return enumValues?.values;
};

export const enumValueForEnumType = (enumName: string, value: string) => {
  const enumValues = getEnumValues(enumName);

  if (enumValues) {
    return enumValues.find((enumValue) => enumValue.name === value);
  }

  return false;
};

export const getPrismaModelForResource = (resource: ModelName) =>
  models.find((datamodel) => datamodel.name === resource);

export const getModelIdProperty = (model: ModelName) => {
  const prismaModel = models.find((m) => m.name === model);
  const idField = prismaModel?.fields.find((f) => f.isId);
  return idField?.name ?? "id";
};

export const getResources = (
  options?: NextAdminOptions
): Prisma.ModelName[] => {
  const definedModels = options?.model
    ? (Object.keys(options.model) as Prisma.ModelName[])
    : [];
  return definedModels.length > 0 ? definedModels : resources;
};

export const getToStringForRelations = <M extends ModelName>(
  modelName: M,
  fieldName: Field<M>,
  modelNameRelation: ModelName,
  options?: NextAdminOptions,
  relationToFields?: any[]
) => {
  const nonCheckedToString =
    // @ts-expect-error
    options?.model?.[modelName]?.edit?.fields?.[fieldName]?.optionFormatter ||
    options?.model?.[modelNameRelation]?.toString;
  const modelRelationIdField = getModelIdProperty(modelNameRelation);
  const toStringForRelations =
    nonCheckedToString && !isNativeFunction(nonCheckedToString)
      ? nonCheckedToString
      : (item: any) =>
          item[relationToFields?.[0]] ?? item[modelRelationIdField];

  return toStringForRelations;
};

/**
 * Order the fields in the schema according to the display option
 *
 * @param schema
 * @param resource
 * @param options
 *
 * @returns schema
 */
export const orderSchema =
  (resource: ModelName, options?: NextAdminOptions) => (schema: Schema) => {
    const modelName = resource;
    const model = models.find((model) => model.name === modelName);
    if (!model) return schema;
    const edit = options?.model?.[modelName]?.edit as EditOptions<
      typeof modelName
    >;
    const display = edit?.display;
    if (display) {
      const properties = schema.definitions[modelName].properties;
      const propertiesOrdered = {} as Record<string, any>;
      display.forEach((property) => {
        if (typeof property === "string") {
          propertiesOrdered[property] = properties[property];
        } else {
          propertiesOrdered[property.id] = {
            type: "null",
            title: property.title,
            description: property.description,
          };
        }
      });
      schema.definitions[modelName].properties = propertiesOrdered;
    }
    return schema;
  };

/**
 * Fill fields with relations with the values of the related model, and inject them into the schema
 *
 * @param schema
 * @param prisma
 * @param requestOptions
 * @param options
 *
 * @returns schema
 */
export const fillRelationInSchema =
  (resource: ModelName, options?: NextAdminOptions) =>
  async (schema: Schema) => {
    const modelName = resource;
    const model = models.find((model) => model.name === modelName);
    const display = options?.model?.[modelName]?.edit?.display;
    let fields;
    if (model?.fields && display) {
      // @ts-expect-error
      fields = model.fields.filter((field) => display.includes(field.name));
    } else {
      fields = model?.fields;
    }

    if (!model || !fields) return schema;
    await Promise.all(
      fields.map(async (field) => {
        const fieldName = field.name as Field<typeof modelName>;
        const fieldType = field.type;
        const fieldKind = field.kind;
        const relationToFields = field.relationToFields;
        const relationFromFields = field.relationFromFields;

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

          if (fieldValue?.default) {
            fieldValue.default =
              typeof fieldValue.default !== "object"
                ? { label: fieldValue.default, value: fieldValue.default }
                : fieldValue.default;
          }
        }
        if (fieldKind === "object") {
          const modelNameRelation = fieldType as ModelName;

          if (relationToFields!.length > 0) {
            //Relation One-to-Many, Many side
            const enumeration: Enumeration[] = [];
            schema.definitions[modelName].properties[fieldName] = {
              type: "string",
              relation: modelNameRelation,
              enum: enumeration,
            };

            const required = schema.definitions[modelName].required;
            const relationFromFieldsRequired = relationFromFields?.every(
              (field) => required?.includes(field)
            );

            if (relationFromFieldsRequired) {
              required?.push(fieldName);
              schema.definitions[modelName].required = required;
            }
          } else {
            const fieldValue =
              schema.definitions[modelName].properties[
                field.name as Field<typeof modelName>
              ];
            if (fieldValue) {
              const enumeration: Enumeration[] = [];

              if (fieldValue.type === "array") {
                //Relation Many-to-One
                fieldValue.items = {
                  type: "string",
                  relation: modelNameRelation,
                  enum: enumeration,
                };
              } else {
                //Relation One-to-One
                fieldValue.type = "string";
                fieldValue.relation = modelNameRelation;
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
  editOptions: EditOptions<M>,
  options: NextAdminOptions
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
    } else if (fieldKind === "enum") {
      acc[key] = data[key] ? { label: data[key], value: data[key] } : null;
    } else if (fieldKind === "object") {
      const modelRelation = field!.type as ModelName;
      const modelRelationIdField = getModelIdProperty(modelRelation);
      const toStringForRelations = getToStringForRelations(
        modelName,
        key as Field<M>,
        modelRelation,
        options
      );
      if (Array.isArray(data[key])) {
        acc[key] = data[key].map((item: any) => {
          if (
            !!editOptions.fields?.[key as Field<M>] &&
            "display" in editOptions.fields[key as Field<M>]! &&
            // @ts-expect-error
            editOptions.fields[key as keyof ObjectField<M>]!.display === "table"
          ) {
            return {
              data: item,
              value: item[modelRelationIdField].value,
            };
          }

          return {
            label: toStringForRelations(item),
            value: item[modelRelationIdField],
          };
        });
      } else {
        acc[key] = data[key]
          ? {
              label: toStringForRelations(data[key]),
              value: data[key][modelRelationIdField],
            }
          : null;
      }
    } else {
      const fieldTypes = field?.type;
      if (fieldTypes === "DateTime") {
        acc[key] = data[key] ? data[key].toISOString() : null;
      } else if (fieldTypes === "Json") {
        acc[key] = data[key] ? JSON.stringify(data[key]) : null;
      } else if (fieldTypes === "Decimal") {
        acc[key] = data[key] ? Number(data[key]) : null;
      } else if (fieldTypes === "BigInt") {
        acc[key] = data[key] ? BigInt(data[key]).toString() : null;
      } else {
        acc[key] = data[key] ? data[key] : null;
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
export const findRelationInData = (
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
        const idProperty = getModelIdProperty(dmmfProperty.type as ModelName);
        data.map((item) => {
          if (item[dmmfPropertyName]) {
            item[dmmfPropertyName] = {
              type: "link",
              value: {
                label: item[dmmfPropertyName],
                url: `${dmmfProperty.type as ModelName}/${
                  item[dmmfPropertyName][idProperty]
                }`,
              },
            };
          }
          return item;
        });
      } else {
        data.map((item) => {
          if (item[dmmfPropertyName]) {
            item[dmmfPropertyName] = {
              type: "count",
              value: item[dmmfPropertyName].length,
            };
          }
          return item;
        });
      }
    }

    if (
      dmmfPropertyType === "DateTime" ||
      dmmfPropertyType === "Decimal" ||
      dmmfPropertyType === "BigInt"
    ) {
      data.map((item) => {
        if (item[dmmfProperty.name]) {
          if (dmmfPropertyType === "DateTime") {
            item[dmmfProperty.name] = {
              type: "date",
              value: item[dmmfProperty.name].toISOString(),
            };
          } else if (dmmfPropertyType === "Decimal") {
            item[dmmfProperty.name] = Number(item[dmmfProperty.name]);
          } else if (dmmfPropertyType === "BigInt") {
            item[dmmfProperty.name] = BigInt(
              item[dmmfProperty.name]
            ).toString();
          }
        } else {
          return item;
        }
      });
    }
  });
  return data;
};

export const parseFormData = <M extends ModelName>(
  formData: AdminFormData<M>,
  dmmfSchema: Prisma.DMMF.Field[]
): Partial<ModelWithoutRelationships<M>> => {
  const parsedData: Partial<ModelWithoutRelationships<M>> = {};
  dmmfSchema.forEach((dmmfProperty) => {
    if (dmmfProperty.name in formData) {
      const dmmfPropertyName = dmmfProperty.name as keyof ScalarField<M>;
      const dmmfPropertyType = dmmfProperty.type;
      const dmmfPropertyKind = dmmfProperty.kind;
      if (dmmfPropertyKind === "object") {
        if (formData[dmmfPropertyName]) {
          parsedData[dmmfPropertyName] = formData[
            dmmfPropertyName
          ] as unknown as ModelWithoutRelationships<M>[typeof dmmfPropertyName];
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
      } else {
        parsedData[dmmfPropertyName] = formData[
          dmmfPropertyName
        ] as unknown as ModelWithoutRelationships<M>[typeof dmmfPropertyName];
      }
    }
  });
  return parsedData;
};

export const formatId = (ressource: ModelName, id: string) => {
  const model = models.find((model) => model.name === ressource);
  const idProperty = getModelIdProperty(ressource);
  return model?.fields.find((field) => field.name === idProperty)?.type ===
    "Int"
    ? Number(id)
    : id;
};
/**
 * Convert the form data to the format expected by Prisma
 *
 * @param formData
 * @param dmmfSchema
 *
 */
export const formattedFormData = async <M extends ModelName>(
  formData: AdminFormData<M>,
  dmmfSchema: Prisma.DMMF.Field[],
  schema: Schema,
  resource: M,
  creating: boolean,
  editOptions?: EditFieldsOptions<M>
) => {
  const formattedData: any = {};
  const modelName = resource;
  const errors: Array<{ field: string; message: string }> = [];

  await Promise.allSettled(
    dmmfSchema.map(async (dmmfProperty) => {
      if (dmmfProperty.name in formData) {
        const dmmfPropertyType = dmmfProperty.type;
        const dmmfPropertyKind = dmmfProperty.kind;
        if (dmmfPropertyKind === "object") {
          const dmmfPropertyName = dmmfProperty.name as keyof ObjectField<M>;
          const dmmfPropertyTypeTyped = dmmfPropertyType as Prisma.ModelName;
          const fieldValue =
            schema.definitions[modelName].properties[
              dmmfPropertyName as Field<typeof dmmfPropertyTypeTyped>
            ];
          if (fieldValue?.type === "array") {
            formData[dmmfPropertyName] = JSON.parse(
              formData[dmmfPropertyName]!
            );
            formattedData[dmmfPropertyName] = {
              // @ts-expect-error
              [creating ? "connect" : "set"]: formData[dmmfPropertyName].map(
                (item: any) => ({
                  id: formatId(dmmfPropertyType as ModelName, item),
                })
              ),
            };
          } else {
            const connect = Boolean(formData[dmmfPropertyName]);
            if (connect) {
              formattedData[dmmfPropertyName] = {
                connect: {
                  id: formatId(
                    dmmfPropertyType as ModelName,
                    formData[dmmfPropertyName]!
                  ),
                },
              };
            } else if (!creating) {
              formattedData[dmmfPropertyName] = { disconnect: true };
            }
          }
        } else {
          const dmmfPropertyName = dmmfProperty.name as keyof ScalarField<M>;
          if (
            dmmfPropertyType === "Int" ||
            dmmfPropertyType === "Float" ||
            dmmfPropertyType === "Decimal"
          ) {
            formattedData[dmmfPropertyName] = !isNaN(
              Number(formData[dmmfPropertyName])
            )
              ? Number(formData[dmmfPropertyName])
              : undefined;
          } else if (dmmfPropertyType === "Boolean") {
            formattedData[dmmfPropertyName] =
              formData[dmmfPropertyName] === "on";
          } else if (dmmfPropertyType === "DateTime") {
            formattedData[dmmfPropertyName] =
              formData[dmmfPropertyName] || null;
          } else if (dmmfPropertyType === "Json") {
            try {
              formattedData[dmmfPropertyName] = formData[dmmfPropertyName]
                ? JSON.parse(formData[dmmfPropertyName]!)
                : null;
            } catch {
              // no-op
            }
          } else if (dmmfPropertyType === "BigInt") {
            formattedData[dmmfPropertyName] = formData[dmmfPropertyName]
              ? BigInt(formData[dmmfPropertyName]!)
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
            const uploadErrorMessage =
              editOptions?.[dmmfPropertyName]?.handler?.uploadErrorMessage;

            if (!uploadHandler) {
              console.warn(
                "You need to provide an upload handler for data-url format"
              );
            } else {
              try {
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
              } catch (e) {
                errors.push({
                  field: dmmfPropertyName.toString(),
                  message:
                    uploadErrorMessage ??
                    `Upload failed: ${(e as Error).message}`,
                });
              }
            }
          } else {
            formattedData[dmmfPropertyName] = formData[dmmfPropertyName];
          }
        }
      }
    })
  );
  return { formattedData, errors };
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
  Object.fromEntries(new URLSearchParams(uri.split("?")[1]));

/**
 *
 * Centralizes the transformation of the schema
 *
 * @param resource
 * @param edit
 * @param prisma
 * @param searchParams
 * @param options
 * @returns
 */
export const transformSchema = <M extends ModelName>(
  resource: M,
  edit: EditOptions<M>,
  options?: NextAdminOptions
) =>
  pipe<Schema>(
    removeHiddenProperties(resource, edit),
    changeFormatInSchema(resource, edit),
    fillRelationInSchema(resource, options),
    fillDescriptionInSchema(resource, edit),
    orderSchema(resource, options)
  );

export const fillDescriptionInSchema = <M extends ModelName>(
  resource: M,
  editOptions: EditOptions<M>
) => {
  return (schema: Schema) => {
    const modelName = resource;
    const model = models.find((model) => model.name === modelName);
    if (!model) return schema;
    model.fields.forEach((dmmfProperty) => {
      const dmmfPropertyName = dmmfProperty.name as Field<typeof modelName>;
      const fieldValue =
        schema.definitions[modelName].properties[
          dmmfPropertyName as Field<typeof modelName>
        ];
      if (fieldValue && editOptions?.fields?.[dmmfPropertyName]?.helperText) {
        fieldValue.description =
          editOptions?.fields?.[dmmfPropertyName]?.helperText;
      }
    });
    return schema;
  };
};

export const changeFormatInSchema =
  <M extends ModelName>(resource: M, editOptions: EditOptions<M>) =>
  (schema: Schema) => {
    const modelName = resource;
    const model = models.find((model) => model.name === modelName);
    if (!model) return schema;
    model.fields.forEach((dmmfProperty) => {
      const dmmfPropertyName = dmmfProperty.name as Field<typeof modelName>;
      const fieldValue =
        schema.definitions[modelName].properties[
          dmmfPropertyName as Field<typeof modelName>
        ];

      if (fieldValue && dmmfProperty.type === "Json") {
        fieldValue.type = "string";
      }

      if (fieldValue && editOptions?.fields?.[dmmfPropertyName]?.input) {
        fieldValue.format = "string";
      } else if (editOptions?.fields?.[dmmfPropertyName]?.format) {
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

export const removeHiddenProperties =
  <M extends ModelName>(resource: M, editOptions: EditOptions<M>) =>
  (schema: Schema) => {
    if (!editOptions?.display) return schema;
    const properties = schema.definitions[resource].properties;
    Object.keys(properties).forEach((property) => {
      if (!editOptions.display?.includes(property as Field<M>)) {
        delete properties[property as Field<M>];
      }
    });
    return schema;
  };

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
  return resources.find((r) => {
    const slugifiedResource = r.toLowerCase();
    return params.some((param) => param.toLowerCase() === slugifiedResource);
  });
};

/**
 * Convert the following urls to an array of params:
 *
 * - /admin/User -> ["User"]
 * - /admin/User/1 -> ["User", "1"]
 * - /_next/data/admin/User.json -> ["User"]
 * - /_next/data/admin/User/1.json -> ["User", "1"]
 * - /_next/data/development/admin/User.json -> ["User"]
 * - /_next/data/development/admin/User/1.json -> ["User", "1"]
 */
export const getParamsFromUrl = (url: string, basePath: string) => {
  let urlWithoutParams = url.split("?")[0];

  if (!urlWithoutParams.startsWith("/_next")) {
    return url.replace(basePath, "").split("?")[0].split("/").filter(Boolean);
  }

  urlWithoutParams = urlWithoutParams
    .slice(urlWithoutParams.indexOf(basePath) + basePath.length)
    .replace(".json", "");

  return urlWithoutParams.split("/").filter(Boolean);
};

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

export const getResourceIdFromParam = (param: string, resource: ModelName) => {
  if (param === "new") {
    return undefined;
  }
  const idProperty = formatId(resource, param);
  return typeof idProperty === "number" && isNaN(idProperty)
    ? undefined
    : idProperty;
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

export const getFormValuesFromFormData = async (formData: FormData) => {
  const tmpFormValues = {} as Record<string, string | File | null>;
  formData.forEach((val, key) => {
    if (key.startsWith("$ACTION")) {
      return;
    }
    tmpFormValues[key] = val;
  });

  const formValues = {} as Record<string, string | Buffer | null>;

  await Promise.allSettled(
    Object.entries(tmpFormValues).map(async ([key, value]) => {
      if (typeof value === "object") {
        const file = value as unknown as File;
        if (file.size === 0) {
          formValues[key] = null;
          return;
        }
        const buffer = await file.arrayBuffer();
        formValues[key] = Buffer.from(buffer);
      } else {
        formValues[key] = value as string;
      }
    })
  );

  return formValues;
};

export const getBody = async (req: IncomingMessage) => {
  return new Promise<string>((resolve) => {
    const bodyParts: Buffer[] = [];
    let body: string;
    req
      .on("data", (chunk) => {
        bodyParts.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(bodyParts).toString();
        resolve(body);
      });
  });
};
