import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
  EditFieldsOptions,
  ModelName,
  ModelOptions,
  NextAdminOptions,
  Permission,
  Schema,
  SubmitResourceResponse,
  UploadedFile,
} from "../types";
import type { PrismaClient } from "../types-prisma";
import { hasPermission } from "../utils/permissions";
import { getDataItem } from "../utils/prisma";
import {
  formatId,
  formattedFormData,
  getModelIdProperty,
  parseFormData,
} from "../utils/server";
import { uncapitalize } from "../utils/tools";
import { validate } from "../utils/validator";

type DeleteResourceParams = {
  prisma: PrismaClient;
  resource: ModelName;
  body: string[] | number[];
  modelOptions?: ModelOptions<ModelName>[ModelName];
};

export const deleteResource = async ({
  prisma,
  resource,
  body,
  modelOptions,
}: DeleteResourceParams) => {
  const modelIdProperty = getModelIdProperty(resource);

  if (modelOptions?.middlewares?.delete) {
    // @ts-expect-error
    const resources = await prisma[uncapitalize(resource)].findMany({
      where: {
        [modelIdProperty]: {
          in: body.map((id) => formatId(resource, id.toString())),
        },
      },
    });

    const middlewareExec: PromiseSettledResult<boolean>[] =
      await Promise.allSettled(
        // @ts-expect-error
        resources.map(async (res) => {
          const isSuccessDelete =
            await modelOptions?.middlewares?.delete?.(res);

          return isSuccessDelete;
        })
      );

    if (
      middlewareExec.some(
        (exec) => exec.status === "rejected" || exec.value === false
      )
    ) {
      return false;
    }
  }

  // @ts-expect-error
  return prisma[uncapitalize(resource)].deleteMany({
    where: {
      [modelIdProperty]: {
        in: body.map((id) => formatId(resource, id.toString())),
      },
    },
  });
};

type SubmitResourceParams = {
  prisma: PrismaClient;
  resource: ModelName;
  body: Record<string, string | (UploadedFile | string)[] | null>;
  id?: string | number;
  options?: NextAdminOptions;
  schema: Schema;
};

export const submitResource = async ({
  prisma,
  resource,
  body,
  id,
  options,
  schema,
}: SubmitResourceParams): Promise<SubmitResourceResponse> => {
  const { __admin_redirect: redirect, ...formValues } = body;

  const schemaDefinition = schema.definitions[resource];
  const parsedFormData = parseFormData(
    formValues,
    schemaDefinition,
    options?.model?.[resource]?.edit?.fields as EditFieldsOptions<
      typeof resource
    >
  );
  const resourceIdField = getModelIdProperty(resource);

  const fields = options?.model?.[resource]?.edit?.fields as EditFieldsOptions<
    typeof resource
  >;

  try {
    validate(parsedFormData, fields);

    const { formattedData, complementaryFormattedData, errors } =
      await formattedFormData(formValues, schema, resource, id, fields, prisma);

    if (errors.length) {
      return {
        error:
          options?.model?.[resource]?.edit?.submissionErrorMessage ??
          "Submission error",
        validation: errors.map((error) => ({
          property: error.field,
          message: error.message,
        })),
      };
    }

    // Edit
    if (!!id) {
      if (!hasPermission(options?.model?.[resource], Permission.EDIT)) {
        return {
          error: "Unable to update items of this model",
        };
      }

      await prisma.$transaction(async (client) => {
        let canEdit = true;
        if (options?.model?.[resource]?.middlewares?.edit) {
          const currentData = await prisma[
            uncapitalize(resource)
            // @ts-expect-error
          ].findUniqueOrThrow({
            where: {
              [resourceIdField]: formatId(resource, id.toString()),
            },
          });

          canEdit = await options?.model?.[resource]?.middlewares?.edit(
            formattedData,
            currentData
          );
        }

        if (!canEdit) {
          throw new Error("Unable to edit this item");
        }

        // @ts-expect-error
        await prisma[resource].update({
          where: {
            [resourceIdField]: id,
          },
          data: formattedData,
        });
      });

      const { data, relationshipsRawData } = await getDataItem({
        prisma,
        resource,
        resourceId: id,
        options,
      });

      return {
        updated: true,
        data,
        redirect: redirect === "list",
        relationshipsRawData,
      };
    }

    if (!hasPermission(options?.model?.[resource], Permission.CREATE)) {
      return {
        error: "Unable to create items of this model",
      };
    }

    // @ts-expect-error
    const data = await prisma[resource].create({
      data: formattedData,
    });

    // @ts-expect-error
    await prisma[resource].update({
      where: {
        [resourceIdField]: data[resourceIdField],
      },
      data: complementaryFormattedData,
    });

    const { data: responseData, relationshipsRawData } = await getDataItem({
      prisma,
      resource,
      resourceId: data[resourceIdField],
      options,
    });

    return {
      created: true,
      createdId: data[resourceIdField],
      data: responseData,
      redirect: redirect === "list",
      relationshipsRawData,
    };
  } catch (error: any) {
    if (
      error.constructor.name === PrismaClientValidationError.name ||
      error.constructor.name === PrismaClientKnownRequestError.name ||
      error.name === "ValidationError"
    ) {
      let data = parsedFormData;

      // TODO This could be improved by merging form values but it's breaking stuff
      if (error.name === "ValidationError") {
        error.errors.map((error: any) => {
          // @ts-expect-error
          data[error.property] = formValues[error.property];
        });
      }

      return {
        error: error.message,
        validation: error.errors,
      };
    }

    throw error;
  }
};
