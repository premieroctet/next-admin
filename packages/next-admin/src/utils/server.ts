import { Prisma, PrismaClient } from "@prisma/client";
import formidable from "formidable";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { Writable } from "node:stream";
import {
  AdminFormData,
  EditFieldsOptions,
  EditOptions,
  Enumeration,
  Field,
  Model,
  ModelAction,
  ModelName,
  ModelWithoutRelationships,
  NextAdminOptions,
  ObjectField,
  OutputModelAction,
  ScalarField,
  Schema,
  SchemaDefinitions,
  SchemaProperty,
  UploadParameters,
} from "../types";
import { getRawData } from "./prisma";
import { isNativeFunction, isUploadParameters, pipe } from "./tools";

export const getJsonSchema = (): Schema => {
  try {
    const schema = require(".next-admin/schema.json");

    return schema as Schema;
  } catch {
    throw new Error(
      "Schema not found, make sure you added the generator to your schema.prisma file"
    );
  }
};

export const globalSchema = getJsonSchema();
export const resources = Object.keys(globalSchema.definitions).filter(
  (modelName) => {
    // Enums are not resources
    return !globalSchema.definitions[modelName as ModelName].enum;
  }
) as ModelName[];

export const enumValueForEnumType = (
  definition: Schema["definitions"][ModelName],
  value: string
): string | false | undefined => {
  if (definition.enum) {
    return definition.enum.find((enumValue) => enumValue === value) as
      | string
      | undefined;
  }

  return false;
};

export const getEnableToExecuteActions = async <M extends ModelName>(
  resource: M,
  prisma: PrismaClient,
  ids: string[] | number[],
  actions?: Omit<ModelAction<M>, "action">[]
): Promise<OutputModelAction | undefined> => {
  if (actions?.some((action) => action.canExecute)) {
    const maxDepth = Math.max(0, ...actions.map((action) => action.depth ?? 0));

    const data: Model<typeof resource>[] = await getRawData<typeof resource>({
      prisma,
      resource,
      resourceIds: ids,
      // Apply the default value if its 0
      maxDepth: maxDepth || undefined,
    });

    return actions?.reduce(
      async (acc, action) => {
        const accResolved = await acc;
        const { canExecute, ...restAction } = action;
        if (canExecute) {
          const allowedIds = data
            .filter((item) =>
              (canExecute as (item: Model<typeof resource>) => boolean)(item)
            )
            .map(
              (item) =>
                item[
                  getModelIdProperty(resource) as keyof Model<typeof resource>
                ]
            ) as string[] | number[];

          accResolved.push({ ...restAction, allowedIds });
        } else {
          accResolved.push(restAction);
        }
        return Promise.resolve(accResolved);
      },
      Promise.resolve([] as OutputModelAction)
    );
  } else {
    return actions?.map((action) => {
      const { canExecute, ...restAction } = action;
      return restAction;
    });
  }
};

export const getModelIdProperty = (model: ModelName) => {
  const schemaModel = globalSchema.definitions[model];

  if (!schemaModel || !schemaModel.properties) {
    return "id";
  }

  const schemaModelProperty = schemaModel.properties;

  return (
    Object.keys(schemaModelProperty).find(
      (property) =>
        schemaModelProperty[property as keyof typeof schemaModelProperty]
          ?.__nextadmin?.primaryKey
    ) ?? "id"
  );
};

const getDeepRelationModel = <M extends ModelName>(
  model: M,
  property: Field<M>
) => {
  const schemaModel = globalSchema.definitions[
    model
  ] as SchemaDefinitions[ModelName];
  const schemaModelProperty = schemaModel.properties;

  const relationField =
    schemaModelProperty[property as keyof typeof schemaModelProperty];
  return relationField;
};

export const modelHasIdField = (model: ModelName) => {
  const schemaModel = globalSchema.definitions[model];
  const schemaModelProperty = schemaModel.properties;

  return Object.entries(schemaModelProperty).some(
    ([, value]) => value.__nextadmin?.primaryKey
  );
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
  options?: NextAdminOptions
) => {
  const editOptions = options?.model?.[modelName]?.edit;
  const relationOptions = options?.model?.[modelNameRelation];
  const explicitManyToManyRelationField =
    // @ts-expect-error
    editOptions?.fields?.[fieldName as Field<M>]?.relationshipSearchField;

  const nonCheckedToString =
    // @ts-expect-error
    editOptions?.fields?.[fieldName]?.[
      explicitManyToManyRelationField
        ? "relationOptionFormatter"
        : "optionFormatter"
    ] || relationOptions?.toString;
  const modelRelationIdField = getModelIdProperty(modelNameRelation);
  const toStringForRelations =
    nonCheckedToString && !isNativeFunction(nonCheckedToString)
      ? nonCheckedToString
      : (item: any) => item[modelRelationIdField];

  return toStringForRelations;
};

export const getToStringForModel = <M extends ModelName>(
  options: Required<NextAdminOptions>["model"][M]
): ((item: Model<M>) => string) | undefined => {
  const nonCheckedToString = options?.toString;
  const toStringForRelations =
    nonCheckedToString && !isNativeFunction(nonCheckedToString)
      ? nonCheckedToString
      : undefined;
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
const orderSchema =
  (resource: ModelName, options?: NextAdminOptions) => (schema: Schema) => {
    const modelName = resource;
    if (!schema.definitions[resource]) return schema;
    const edit = options?.model?.[modelName]?.edit as EditOptions<
      typeof modelName
    >;
    const display = edit?.display;
    if (display) {
      const properties = schema.definitions[modelName].properties;
      const propertiesOrdered = {} as Record<string, any>;
      display.forEach((property) => {
        if (typeof property === "string") {
          propertiesOrdered[property] =
            properties[property as Field<typeof modelName>];
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
    const modelSchema = schema.definitions[
      modelName
    ] as SchemaDefinitions[ModelName];
    const modelProperties = modelSchema?.properties;
    const display = options?.model?.[modelName]?.edit?.display;
    let fields;
    if (modelProperties && display) {
      fields = Object.entries(modelProperties).filter(([field]) =>
        display.includes(field)
      );
    } else {
      fields = Object.entries(modelProperties);
    }

    if (!modelSchema || !fields) return schema;

    await Promise.all(
      fields.map(async ([name, value]) => {
        const fieldName = name as Field<typeof modelName>;
        const fieldNextAdmin = value.__nextadmin;
        const fieldType = fieldNextAdmin?.type;
        const fieldKind = fieldNextAdmin?.kind;
        const relationFromField = fieldNextAdmin?.relation?.fromField;

        if (fieldKind === "enum") {
          const fieldValue =
            schema.definitions[modelName].properties[
              name as Field<typeof modelName>
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

          let fieldValue =
            schema.definitions[modelName].properties[
              name as Field<typeof modelName>
            ];

          if (!fieldValue) return;

          delete fieldValue.$ref;

          const enumeration: Enumeration[] = [];
          const required = schema.definitions[modelName].required;
          const relationFromFieldsRequired = required?.includes(
            relationFromField!
          );

          if (relationFromFieldsRequired) {
            required?.push(fieldName);
            schema.definitions[modelName].required = required;
          }

          if (fieldValue.type !== "array") {
            //Relation One-to-Many, Many side
            fieldValue.type = "string";
            fieldValue.relation = modelNameRelation;
            fieldValue.enum = enumeration;
            fieldValue.__nextadmin = fieldNextAdmin;
          } else {
            //Relation Many-to-One
            fieldValue.items = {
              type: "string",
              relation: modelNameRelation,
              enum: enumeration,
            };

            delete fieldValue.anyOf;
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
  options?: NextAdminOptions
) => {
  const modelName = resource;
  const model = globalSchema.definitions[
    modelName
  ] as SchemaDefinitions[ModelName];
  if (!model) return data;

  const schemaProperties = model.properties;

  return Object.keys(data).reduce(
    async (accP, key) => {
      const acc = await accP;
      const field = schemaProperties[key as keyof typeof schemaProperties];
      const fieldKind = field?.__nextadmin?.kind;
      const get = editOptions?.fields?.[key as Field<M>]?.handler?.get;
      const explicitManyToManyRelationField =
        // @ts-expect-error
        editOptions?.fields?.[key as Field<M>]?.relationshipSearchField;

      if (get) {
        acc[key] = await get(data[key]);
      } else if (fieldKind === "enum") {
        const value = data[key];
        if (Array.isArray(value)) {
          acc[key] = value.map((item) => {
            return { label: item, value: item };
          });
        } else {
          acc[key] = value ? { label: value, value } : null;
        }
      } else if (fieldKind === "object") {
        const modelRelation = field?.__nextadmin?.type as ModelName;
        const modelRelationIdField = getModelIdProperty(modelRelation);
        let deepRelationModel:
          | SchemaProperty<ModelName>[Field<ModelName>]
          | undefined;
        let deepModelRelationIdField: string;

        if (explicitManyToManyRelationField) {
          deepRelationModel = getDeepRelationModel(
            modelRelation,
            explicitManyToManyRelationField
          );
          deepModelRelationIdField = getModelIdProperty(
            deepRelationModel?.__nextadmin?.type as ModelName
          );
        }

        const toStringForRelations = getToStringForRelations(
          modelName,
          key as Field<M>,
          explicitManyToManyRelationField
            ? (deepRelationModel?.__nextadmin?.type as ModelName)
            : modelRelation,
          options
        );

        if (Array.isArray(data[key])) {
          acc[key] = data[key].map((item: any) => {
            if (
              !!editOptions?.fields?.[key as Field<M>] &&
              "display" in editOptions.fields[key as Field<M>]! &&
              // @ts-expect-error
              editOptions.fields[key as keyof ObjectField<M>]!.display ===
                "table"
            ) {
              return {
                data: item,
                value: item[modelRelationIdField].value,
              };
            }

            return {
              label: explicitManyToManyRelationField
                ? toStringForRelations(item[explicitManyToManyRelationField])
                : toStringForRelations(item),
              value: explicitManyToManyRelationField
                ? item[explicitManyToManyRelationField]?.[
                    deepModelRelationIdField
                  ]
                : item[modelRelationIdField],
              data: {
                modelName: deepRelationModel?.__nextadmin?.type as ModelName,
              },
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
      } else if (
        field?.__nextadmin?.isList &&
        field.__nextadmin?.kind === "scalar"
      ) {
        acc[key] = data[key];
      } else {
        const fieldTypes = field?.__nextadmin?.type;
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
    },
    Promise.resolve({}) as any
  );
};

/**
 * Fill fields in data with the their values and url for the related model
 *
 * @param data
 * @param schema
 *
 * @returns data
 * */
export const findRelationInData = (
  data: any[],
  schema: SchemaDefinitions[ModelName]
) => {
  Object.entries(schema.properties).forEach(([property, value]) => {
    const propertyType = value.__nextadmin?.type;
    const propertyKind = value.__nextadmin?.kind;
    const propertyRelationFrom = value.__nextadmin?.relation?.fromField;
    const propertyRelationToField = value.__nextadmin?.relation?.toField;
    const isList = value.__nextadmin?.isList;

    if (propertyKind === "object") {
      /**
       * Handle one-to-one relation
       * Make sure that we are in a relation that is not a list
       * because one side of a one-to-one relation will not have relationFromFields
       */
      if (propertyRelationFrom && propertyRelationToField && !isList) {
        const idProperty = getModelIdProperty(propertyType as ModelName);
        data.forEach((item) => {
          if (item[property]) {
            item[property] = {
              type: "link",
              value: {
                label: item[property],
                url: `${propertyType as ModelName}/${
                  item[property][idProperty]
                }`,
              },
            };
          }
          return item;
        });
      } else {
        data.forEach((item) => {
          if (item[property]) {
            item[property] = {
              type: "count",
              value: item[property].length,
            };
          }
          return item;
        });
      }
    }

    if (["scalar", "enum"].includes(propertyKind ?? "") && isList) {
      data.forEach((item) => {
        if (item[property]) {
          item[property] = {
            type: "count",
            value: item[property].length,
          };
        }
        return item;
      });
    }

    if (
      propertyType === "DateTime" ||
      propertyType === "Decimal" ||
      propertyType === "BigInt"
    ) {
      data.forEach((item) => {
        if (item[property]) {
          if (propertyType === "DateTime") {
            item[property] = {
              type: "date",
              value: item[property].toISOString(),
            };
          } else if (propertyType === "Decimal") {
            item[property] = Number(item[property]);
          } else if (propertyType === "BigInt") {
            item[property] = BigInt(item[property]).toString();
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
  schemaResource: SchemaDefinitions[ModelName]
): Partial<ModelWithoutRelationships<M>> => {
  const parsedData: Partial<ModelWithoutRelationships<M>> = {};
  Object.entries(schemaResource.properties).forEach(([property, value]) => {
    if (property in formData) {
      const formPropertyName = property as keyof ScalarField<M>;
      const propertyNextAdminData = value.__nextadmin;
      const propertyType = propertyNextAdminData?.type;
      const propertyKind = propertyNextAdminData?.kind;
      if (propertyKind === "object") {
        if (formData[formPropertyName]) {
          parsedData[formPropertyName] = formData[
            formPropertyName
          ] as unknown as ModelWithoutRelationships<M>[typeof formPropertyName];
        } else {
          parsedData[formPropertyName] =
            null as ModelWithoutRelationships<M>[typeof formPropertyName];
        }
      } else if (
        propertyNextAdminData?.isList &&
        propertyNextAdminData.kind === "scalar"
      ) {
        parsedData[formPropertyName] = JSON.parse(
          formData[formPropertyName]!
        ) as unknown as ModelWithoutRelationships<M>[typeof formPropertyName];
      } else if (propertyType === "Int") {
        const value = Number(formData[formPropertyName]) as number;
        parsedData[formPropertyName] = isNaN(value)
          ? undefined
          : (value as ModelWithoutRelationships<M>[typeof formPropertyName]);
      } else if (propertyType === "Boolean") {
        parsedData[formPropertyName] = (formData[formPropertyName] ===
          "on") as unknown as ModelWithoutRelationships<M>[typeof formPropertyName];
      } else {
        parsedData[formPropertyName] = formData[
          formPropertyName
        ] as unknown as ModelWithoutRelationships<M>[typeof formPropertyName];
      }
    }
  });
  return parsedData;
};

export const formatId = (resource: ModelName, id: string) => {
  const model = globalSchema.definitions[
    resource
  ] as SchemaDefinitions[ModelName];
  const modelProperties = model.properties;
  const idProperty = getModelIdProperty(resource);

  return Object.entries(modelProperties).find(
    ([name]) => name === idProperty
  )?.[1].__nextadmin?.type === "Int"
    ? Number(id)
    : id;
};

const getExplicitManyToManyTableFields = <M extends ModelName>(
  manyToManyResource: M
) => {
  const model = globalSchema.definitions[
    manyToManyResource
  ] as SchemaDefinitions[ModelName];
  const modelProperties = model.properties;

  const relationFields = Object.entries(modelProperties).filter(
    ([, value]) => value.__nextadmin?.kind === "object"
  );

  return relationFields;
};

const getExplicitManyToManyTablePrimaryKey = <M extends ModelName>(
  resource: M
) => {
  const model = globalSchema.definitions[
    resource
  ] as SchemaDefinitions[ModelName];

  return {
    name: model?.__nextadmin?.primaryKeyField?.name,
    fields: model?.__nextadmin?.primaryKeyField?.fields,
  };
};

/**
 * Convert the form data to the format expected by Prisma
 *
 * @param formData
 * @param schema
 * @param resource
 * @param resourceId
 * @param editOptions
 */
export const formattedFormData = async <M extends ModelName>(
  formData: AdminFormData<M>,
  schema: Schema,
  resource: M,
  resourceId: string | number | undefined,
  editOptions?: EditFieldsOptions<M>
) => {
  const formattedData: any = {};
  const complementaryFormattedData: any = {};
  const modelName = resource;
  const errors: Array<{ field: string; message: string }> = [];
  const creating = resourceId === undefined;
  const resourceSchema = schema.definitions[
    modelName
  ] as SchemaDefinitions[ModelName];

  const results = await Promise.allSettled(
    Object.entries(resourceSchema.properties).map(async ([property, value]) => {
      if (property in formData) {
        const propertyNextAdminData = value.__nextadmin;
        const propertyType = propertyNextAdminData?.type;
        const propertyKind = propertyNextAdminData?.kind;
        const isList = propertyNextAdminData?.isList;
        if (propertyKind === "object") {
          const propertyName = property as keyof ObjectField<M>;
          const propertyTypeTyped = propertyType as Prisma.ModelName;
          const fieldValue =
            schema.definitions[modelName].properties[
              propertyName as Field<typeof propertyTypeTyped>
            ];
          if (fieldValue?.type === "array") {
            formData[propertyName] = JSON.parse(formData[propertyName]!);

            const fieldOptions = editOptions?.[propertyName];

            const orderField =
              fieldOptions &&
              "orderField" in fieldOptions &&
              fieldOptions.orderField;

            if (
              fieldOptions &&
              "relationshipSearchField" in fieldOptions &&
              fieldOptions?.relationshipSearchField
            ) {
              const relationFields =
                getExplicitManyToManyTableFields(propertyTypeTyped)!;

              const currentResourceField = relationFields.filter(
                ([, field]) => field.__nextadmin?.type === resource
              )[0];
              const externalResourceField = relationFields.filter(
                ([, field]) => field.__nextadmin?.type !== resource
              )[0];

              if (creating) {
                formattedData[propertyName] = {
                  create: (
                    formData[propertyName] as unknown as Enumeration["value"][]
                  ).map((item, index) => {
                    const data: Record<string, any> = {
                      [externalResourceField[0]]: {
                        connect: {
                          id: formatId(
                            externalResourceField[1].__nextadmin
                              ?.type as ModelName,
                            item
                          ),
                        },
                      },
                    };

                    if (orderField) {
                      data[orderField as string] = index;
                    }

                    return data;
                  }),
                };
              } else {
                const resourcePrimaryKey =
                  getExplicitManyToManyTablePrimaryKey(propertyTypeTyped)!;

                const resourcePrimaryKeyCurrentResourceField =
                  resourcePrimaryKey.fields!.find(
                    (field) =>
                      field ===
                      currentResourceField[1].__nextadmin?.relation
                        ?.fromFieldDbName
                  )!;
                const resourcePrimaryKeyExternalResourceField =
                  resourcePrimaryKey.fields!.find(
                    (field) =>
                      field ===
                      externalResourceField[1].__nextadmin?.relation
                        ?.fromFieldDbName
                  )!;

                formattedData[propertyName] = {
                  upsert: (
                    formData[propertyName] as unknown as Enumeration["value"][]
                  ).map((item, index) => {
                    const formattedItem: Record<string, any> = {
                      create: {
                        [externalResourceField[0]]: {
                          connect: {
                            id: formatId(
                              externalResourceField[1].__nextadmin
                                ?.type as ModelName,
                              item
                            ),
                          },
                        },
                      },
                      where: {
                        [resourcePrimaryKey.name!]: {
                          [resourcePrimaryKeyCurrentResourceField]: formatId(
                            resource,
                            resourceId.toString()
                          ),
                          [resourcePrimaryKeyExternalResourceField]: formatId(
                            externalResourceField[1]?.__nextadmin
                              ?.type as ModelName,
                            item
                          ),
                        },
                      },
                      update: {
                        [externalResourceField[0]]: {
                          connect: {
                            id: formatId(
                              externalResourceField[1]?.__nextadmin
                                ?.type as ModelName,
                              item
                            ),
                          },
                        },
                      },
                    };

                    if (orderField) {
                      formattedItem.create[orderField as string] = index;
                      formattedItem.update[orderField as string] = index;
                    }

                    return formattedItem;
                  }),
                  deleteMany: {
                    [resourcePrimaryKeyCurrentResourceField]: formatId(
                      resource,
                      resourceId.toString()
                    ),
                    [resourcePrimaryKeyExternalResourceField]: {
                      notIn: (
                        formData[
                          propertyName
                        ] as unknown as Enumeration["value"][]
                      ).map((item) =>
                        formatId(
                          externalResourceField[1]?.__nextadmin
                            ?.type as ModelName,
                          item
                        )
                      ),
                    },
                  },
                };
              }
            } else {
              const updateRelatedField = {
                ...(orderField && {
                  update: formData[
                    propertyName
                    // @ts-expect-error
                  ]?.map((item: any, index: number) => {
                    return {
                      where: {
                        id: formatId(propertyType as ModelName, item),
                      },
                      data: {
                        ...(orderField && {
                          [orderField]: index,
                        }),
                      },
                    };
                  }),
                }),
              };

              formattedData[propertyName] = {
                // @ts-expect-error
                [creating ? "connect" : "set"]: formData[propertyName].map(
                  (item: any) => ({
                    id: formatId(propertyType as ModelName, item),
                  })
                ),
                ...(!creating && updateRelatedField),
              };

              if (creating) {
                complementaryFormattedData[propertyName] = updateRelatedField;
              }
            }
          } else {
            const connect = Boolean(formData[propertyName]);
            if (connect) {
              formattedData[propertyName] = {
                connect: {
                  id: formatId(
                    propertyType as ModelName,
                    formData[propertyName]!
                  ),
                },
              };
            } else if (!creating) {
              formattedData[propertyName] = { disconnect: true };
            }
          }
        } else if (propertyKind === "scalar" && isList) {
          const propertyName = property as keyof ScalarField<M>;

          const formDataValue = JSON.parse(formData[propertyName]!) as
            | string[]
            | number[];

          if (
            propertyType === "Int" ||
            propertyType === "Float" ||
            propertyType === "Decimal"
          ) {
            formattedData[propertyName] = {
              set: formDataValue
                .map((item) =>
                  !isNaN(Number(item)) ? Number(item) : undefined
                )
                .filter(Boolean),
            };
          } else {
            formattedData[propertyName] = {
              set: formDataValue,
            };
          }
        } else if (propertyKind === "enum" && isList) {
          const propertyName = property as keyof ScalarField<M>;

          const data = JSON.parse(formData[propertyName] ?? "[]");
          formattedData[propertyName] = {
            set: data,
          };
        } else {
          const propertyName = property as keyof ScalarField<M>;
          if (formData[propertyName] === "") {
            formattedData[propertyName] = null;
          } else if (
            propertyType === "Int" ||
            propertyType === "Float" ||
            propertyType === "Decimal"
          ) {
            formattedData[propertyName] = !isNaN(Number(formData[propertyName]))
              ? Number(formData[propertyName])
              : undefined;
          } else if (propertyType === "Boolean") {
            formattedData[propertyName] = formData[propertyName] === "on";
          } else if (propertyType === "DateTime") {
            formattedData[propertyName] = formData[propertyName]
              ? new Date(formData[propertyName]!)
              : null;
          } else if (propertyType === "Json") {
            try {
              formattedData[propertyName] = formData[propertyName]
                ? JSON.parse(formData[propertyName]!)
                : null;
            } catch {
              // no-op
            }
          } else if (propertyType === "BigInt") {
            formattedData[propertyName] = formData[propertyName]
              ? BigInt(formData[propertyName]!)
              : null;
          } else if (
            propertyType === "String" &&
            ["data-url", "file"].includes(
              editOptions?.[propertyName]?.format ?? ""
            ) &&
            isUploadParameters(formData[propertyName])
          ) {
            const uploadHandler = editOptions?.[propertyName]?.handler?.upload;
            const uploadErrorMessage =
              editOptions?.[propertyName]?.handler?.uploadErrorMessage;

            if (!uploadHandler) {
              console.warn(
                "You need to provide an upload handler for data-url format"
              );
            } else {
              try {
                const uploadResult = await uploadHandler(
                  ...(formData[propertyName] as unknown as UploadParameters),
                  {
                    resourceId,
                  }
                );
                if (typeof uploadResult !== "string") {
                  console.warn(
                    "Upload handler must return a string, fallback to no-op for field " +
                      propertyName.toString()
                  );
                } else {
                  formattedData[propertyName] = uploadResult;
                }
              } catch (e) {
                errors.push({
                  field: propertyName.toString(),
                  message:
                    uploadErrorMessage ??
                    `Upload failed: ${(e as Error).message}`,
                });
              }
            }
          } else {
            formattedData[propertyName] = formData[propertyName];
          }
        }
      }
    })
  );

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(result.reason);
    }
  });

  return { formattedData, complementaryFormattedData, errors };
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
    addCustomProperties(resource, edit),
    orderSchema(resource, options)
  );

export const applyVisiblePropertiesInSchema = <M extends ModelName>(
  resource: M,
  edit: EditOptions<M>,
  data: any,
  schema: Schema
) => {
  const modelName = resource;
  const modelSchema = schema.definitions[
    modelName
  ] as SchemaDefinitions[ModelName];
  if (!modelSchema) return schema;
  const display = edit?.display;
  const fields = edit?.fields;
  if (display) {
    display.forEach((property) => {
      if (
        schema.definitions?.[modelName]?.properties &&
        fields?.[property]?.visible?.(data) === false
      ) {
        // @ts-expect-error
        delete schema.definitions[modelName].properties[property];
      }
    });
  }
  return schema;
};

const fillDescriptionInSchema = <M extends ModelName>(
  resource: M,
  editOptions: EditOptions<M>
) => {
  return (schema: Schema) => {
    const modelName = resource;
    const modelSchema = schema.definitions[
      modelName
    ] as SchemaDefinitions[ModelName];
    if (!modelSchema) return schema;
    Object.entries(modelSchema.properties).forEach(([name, value]) => {
      const propertyName = name as Field<typeof modelName>;
      const fieldValue = schema.definitions[modelName].properties[propertyName];
      if (fieldValue && editOptions?.fields?.[propertyName]?.helperText) {
        fieldValue.description =
          editOptions?.fields?.[propertyName]?.helperText;
      }
    });
    return schema;
  };
};

export const changeFormatInSchema =
  <M extends ModelName>(resource: M, editOptions: EditOptions<M>) =>
  (schema: Schema) => {
    const modelName = resource;
    const modelSchema = schema.definitions[
      modelName
    ] as SchemaDefinitions[ModelName];
    if (!modelSchema) return schema;
    Object.entries(modelSchema.properties).forEach(([name, value]) => {
      const propertyName = name as Field<typeof modelName>;
      const fieldValue =
        schema.definitions[modelName].properties[
          propertyName as Field<typeof modelName>
        ];

      if (fieldValue && value.__nextadmin?.type === "Json") {
        fieldValue.type = "string";
      }

      if (fieldValue && editOptions?.fields?.[propertyName]?.input) {
        fieldValue.format = "string";
      } else if (editOptions?.fields?.[propertyName]?.format) {
        if (fieldValue) {
          if (editOptions?.fields?.[propertyName]?.format === "file") {
            fieldValue.format = "data-url";
          } else {
            fieldValue.format = editOptions?.fields?.[propertyName]?.format;
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
      if (!editOptions?.display?.includes(property as Field<M>)) {
        delete properties[property as Field<M>];
      }
    });
    return schema;
  };

export const addCustomProperties =
  <M extends ModelName>(resource: M, editOptions: EditOptions<M>) =>
  (schema: Schema) => {
    const customFieldKeys = Object.keys(editOptions?.customFields ?? {});

    customFieldKeys.forEach((property) => {
      const fieldOptions = editOptions?.customFields?.[property];
      if (fieldOptions) {
        schema.definitions[resource].properties[
          property as Field<typeof resource>
        ] = {
          type: "string",
          description: fieldOptions?.helperText ?? "",
        };

        if (fieldOptions.required) {
          schema.definitions[resource].required?.push(property);
        }

        if (fieldOptions.format) {
          schema.definitions[resource].properties[
            property as Field<typeof resource>
          ]!.format = fieldOptions.format;
        }
      }
    });

    return schema;
  };

export const getResourceFromParams = (
  params: string[],
  resources: Prisma.ModelName[]
) => {
  return (
    resources.find((r) => {
      const slugifiedResource = r.toLowerCase();
      return params.some((param) => param.toLowerCase() === slugifiedResource);
    }) ?? null
  );
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
  return new Promise<Record<string, string | UploadParameters | null>>(
    (resolve, reject) => {
      const files = {} as Record<string, UploadParameters[] | [null]>;

      form.on("fileBegin", (name, file) => {
        // @ts-expect-error
        file.createFileWriteStream = () => {
          const chunks: Buffer[] = [];
          return new Writable({
            write(chunk, _encoding, callback) {
              chunks.push(chunk);
              callback();
            },
            final(callback) {
              if (!file.originalFilename) {
                files[name] = [null];
              } else {
                files[name] = [
                  [
                    Buffer.concat(chunks),
                    {
                      name: file.originalFilename,
                      type: file.mimetype,
                    },
                  ],
                ];
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
          {} as Record<string, string | UploadParameters | null>
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

  const formValues = {} as Record<string, string | UploadParameters | null>;

  await Promise.allSettled(
    Object.entries(tmpFormValues).map(async ([key, value]) => {
      if (typeof value === "object") {
        const file = value as unknown as File;
        if (file.size === 0) {
          formValues[key] = null;
          return;
        }
        const buffer = await file.arrayBuffer();
        formValues[key] = [
          Buffer.from(buffer),
          {
            name: file.name,
            type: file.type,
          },
        ];
      } else {
        formValues[key] = value as string;
      }
    })
  );

  return formValues;
};

export const getJsonBody = async (req: NextApiRequest): Promise<any> => {
  let body = await getBody(req);

  // Handle case where bodyParser is disabled
  if (
    body &&
    typeof body === "string" &&
    req.headers["content-type"] === "application/json"
  ) {
    body = JSON.parse(body);
  }

  return body;
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
