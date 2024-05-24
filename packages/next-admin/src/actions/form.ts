"use server";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
  ActionFullParams,
  EditFieldsOptions,
  Permission,
  SubmitFormResult,
} from "../types";
import {
  formattedFormData,
  getFormValuesFromFormData,
  getModelIdProperty,
  getPrismaModelForResource,
  getResourceFromParams,
  getResourceIdFromParam,
  getResources,
  parseFormData,
} from "../utils/server";
import { validate } from "../utils/validator";

export const submitForm = async (
  { options, params, schema, prisma }: ActionFullParams,
  formData: FormData
): Promise<SubmitFormResult | undefined> => {
  if (!params) {
    return;
  }

  const resources = getResources(options);
  const resource = getResourceFromParams(params, resources);

  if (!resource) {
    return;
  }

  const resourceIdField = getModelIdProperty(resource);

  const resourceId = getResourceIdFromParam(params[1], resource);

  const {
    __admin_redirect: redirect,
    __admin_action: action,
    ...formValues
  } = await getFormValuesFromFormData(formData);

  const dmmfSchema = getPrismaModelForResource(resource);
  const parsedFormData = parseFormData(formValues, dmmfSchema?.fields!);

  try {
    if (action === "delete") {
      if (resourceId !== undefined) {
        if (
          options?.model?.[resource]?.permissions &&
          !options?.model?.[resource]?.permissions?.includes(Permission.DELETE)
        ) {
          return {
            error: "Unable to delete items of this model",
          };
        }

        // @ts-expect-error
        await prisma[resource].delete({
          where: {
            [resourceIdField]: resourceId,
          },
        });
      }
      return { deleted: true };
    }

    // Update
    let data;

    const fields = options.model?.[resource]?.edit?.fields as EditFieldsOptions<
      typeof resource
    >;

    // Validate
    validate(parsedFormData, fields);

    const { formattedData, complementaryFormattedData, errors } =
      await formattedFormData(
        formValues,
        dmmfSchema?.fields!,
        schema,
        resource,
        resourceId,
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

    if (resourceId !== undefined) {
      if (
        options?.model?.[resource]?.permissions &&
        !options?.model?.[resource]?.permissions?.includes(Permission.EDIT)
      ) {
        return {
          error: "Unable to update items of this model",
        };
      }

      // @ts-expect-error
      data = await prisma[resource].update({
        where: {
          [resourceIdField]: resourceId,
        },
        data: formattedData,
      });

      return { updated: true, redirect: redirect === "list" };
    }

    // Create
    if (
      options?.model?.[resource]?.permissions &&
      !options?.model?.[resource]?.permissions?.includes(Permission.CREATE)
    ) {
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
      error.constructor.name === PrismaClientValidationError.name ||
      error.constructor.name === PrismaClientKnownRequestError.name ||
      error.name === "ValidationError"
    ) {
      let data = parsedFormData;

      // TODO This could be improved by merging form values but it's breaking stuff
      if (error.name === "ValidationError") {
        error.errors.map((error: any) => {
          // @ts-expect-error
          data[error.property] = formData[error.property];
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
