import { PrismaClient } from "@prisma/client";
import {
  EditFieldsOptions,
  ModelName,
  NextAdminOptions,
  Permission,
} from "../types";
import {
  formattedFormData,
  getModelIdProperty,
  getPrismaModelForResource,
  parseFormData,
} from "../utils/server";
import { uncapitalize } from "../utils/tools";
import { validate } from "../utils/validator";
import { hasPermission } from "../utils/permissions";

type DeleteResourceParams = {
  prisma: PrismaClient;
  resource: ModelName;
  body: string[] | number[];
};

export const deleteResource = ({
  prisma,
  resource,
  body,
}: DeleteResourceParams) => {
  const modelIdProperty = getModelIdProperty(resource);

  // @ts-expect-error
  return prisma[uncapitalize(resource)].deleteMany({
    where: {
      [modelIdProperty]: {
        in: body,
      },
    },
  });
};

type SubmitResourceParams = {
  prisma: PrismaClient;
  resource: ModelName;
  body: Record<string, string | File | null>;
  id?: string | number;
  options: NextAdminOptions;
  schema: any;
};

export const submitResource = async ({
  prisma,
  resource,
  body,
  id,
  options,
  schema,
}: SubmitResourceParams) => {
  const { __admin_redirect: redirect, ...formValues } = body;

  const dmmfSchema = getPrismaModelForResource(resource);
  const parsedFormData = parseFormData(formValues, dmmfSchema?.fields!);
  const resourceIdField = getModelIdProperty(resource);

  let data;

  const fields = options.model?.[resource]?.edit?.fields as EditFieldsOptions<
    typeof resource
  >;

  try {
    validate(parsedFormData, fields);

    const { formattedData, complementaryFormattedData, errors } =
      await formattedFormData(
        formValues,
        dmmfSchema?.fields!,
        schema,
        resource,
        id,
        fields
      );

    if (errors.length) {
      return {
        error:
          options.model?.[resource]?.edit?.submissionErrorMessage ??
          "Submission error",
        validation: errors.map((error) => ({
          property: error.field,
          message: error.message,
        })),
      };
    }

    // Edit
    if (!!id) {
      if (!hasPermission(options.model?.[resource], Permission.EDIT)) {
        return {
          error: "Unable to update items of this model",
        };
      }

      // @ts-expect-error
      data = await prisma[resource].update({
        where: {
          [resourceIdField]: id,
        },
        data: formattedData,
      });

      return { updated: true, redirect: redirect === "list" };
    }

    if (!hasPermission(options.model?.[resource], Permission.CREATE)) {
      return {
        error: "Unable to create items of this model",
      };
    }

    // @ts-expect-error
    data = await prisma[resource].create({
      data: formattedData,
    });

    // @ts-expect-error
    await prisma[resource].update({
      where: {
        [resourceIdField]: data[resourceIdField],
      },
      data: complementaryFormattedData,
    });

    return {
      created: true,
      createdId: data[resourceIdField],
      redirect: redirect === "list",
    };
  } catch (error: any) {
    if (
      error.constructor.name === 'PrismaClientValidationError' ||
      error.constructor.name === 'PrismaClientKnownRequestError' ||
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
