import { Prisma, PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import util from "util";
import {
  Field,
  ModelName,
  NextAdminOptions,
  Schema,
  FormData,
  Enumeration,
  ListFieldsOptions,
  UField,
  EditFieldsOptions,
} from "../types";
import { createWherePredicate } from "./prisma";
import { isNativeFunction, uncapitalize } from "./tools";
export const getBody = util.promisify(bodyParser.urlencoded());

export const models = Prisma.dmmf.datamodel.models;
export const resources = models.map((model) => model.name as ModelName);

export const getPrismaModelForResource = (
  resource: ModelName
): Prisma.DMMF.Model | undefined =>
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
        type ListFieldOptionsModel = ListFieldsOptions<
          typeof modelNameRelation
        >;
        const listFields = options?.model?.[modelNameRelation]?.list
          ?.fields as ListFieldOptionsModel;
        const listKeys =
          listFields &&
          (Object.keys(listFields) as Array<keyof ListFieldOptionsModel>);
        const optionsForRelations =
          listKeys?.filter((key) => listFields[key]?.search) ??
          remoteModel?.fields.map((field) => field.name);
        const relationProperty: Field<typeof modelName> =
          (relationFromFields?.[0] as Field<typeof modelName>) ?? fieldName;
        const fieldsFiltered = remoteModel?.fields.filter((field) =>
          (optionsForRelations as string[])?.includes(field.name)
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
          // @ts-expect-error
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

export const flatRelationInData = (data: any, resource: ModelName) => {
  const modelName = resource;
  const model = models.find((model) => model.name === modelName);
  if (!model) return data;
  return Object.keys(data).reduce((acc, key) => {
    const field = model.fields.find((field) => field.name === key);
    const fieldKind = field?.kind;
    if (fieldKind === "object") {
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
    const dmmfPropertyType = dmmfProperty.type;
    const dmmfPropertyKind = dmmfProperty.kind;
    const dmmfPropertyRelationFromFields = dmmfProperty.relationFromFields;
    const dmmfPropertyRelationToFields = dmmfProperty.relationToFields;
    
    if (dmmfPropertyKind === "object") {
      if (
        dmmfPropertyRelationFromFields!.length > 0 &&
        dmmfPropertyRelationToFields!.length > 0
      ) {
        const relationProperty = dmmfPropertyRelationFromFields![0];
        data.map((item) => {
          if (item[relationProperty]) {
            item[relationProperty] = {
              type: "link",
              value: {
                label: item[relationProperty],
                url: `${dmmfProperty.type as ModelName}/${
                  item[relationProperty]
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
            value: new Date(item[dmmfProperty.name]).toLocaleString("fr-FR"),
          };
        } else {
          return item;
        }
      });
    }
  });
  return data;
};

/**
 * Convert the form data to the format expected by Prisma
 *
 * @param formData
 * @param dmmfSchema
 *
 */
export const formattedFormData = <M extends ModelName>(
  formData: FormData<M>,
  dmmfSchema: Prisma.DMMF.Field[],
  schema: Schema,
  resource: M,
  creating: boolean
) => {
  const formattedData: any = {};
  const modelName = resource;
  dmmfSchema.forEach((dmmfProperty) => {
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
        if (fieldValue.type === "array") {
          formData[dmmfPropertyName] = JSON.parse(formData[dmmfPropertyName]!);
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
          formattedData[dmmfPropertyName] = formData[dmmfPropertyName] === "on";
        } else if (dmmfPropertyType === "DateTime") {
          formattedData[dmmfPropertyName] =
            new Date(formData[dmmfPropertyName]!) ?? null;
        } else {
          formattedData[dmmfPropertyName] = formData[dmmfPropertyName];
        }
      }
    }
  });
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

export const removeHiddenProperties = <M extends ModelName>(
  schema: Schema,
  editOptions: EditFieldsOptions<M>,
  resource: M
) => {
  if (!editOptions) return schema;
  const properties = schema.definitions[resource].properties;
  Object.keys(properties).forEach((property) => {
    if (!editOptions[property as UField<M>]?.display) {
      delete properties[property as UField<M>];
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
