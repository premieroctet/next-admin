"use server";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
  ActionFullParams,
  EditFieldsOptions,
  SubmitFormResult,
} from "../types";
import {
  formattedFormData,
  getFormValuesFromFormData,
  getResourceFromParams,
  getResourceIdFromParam,
  getResources,
  parseFormData,
  getPrismaModelForResource,
  getModelIdProperty,
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

    if (resourceId !== undefined) {
      // @ts-expect-error
      data = await prisma[resource].update({
        where: {
          [resourceIdField]: resourceId,
        },
        data: await formattedFormData(
          formValues,
          dmmfSchema?.fields!,
          schema,
          resource,
          false,
          fields
        ),
      });

      return { updated: true, redirect: redirect === "list" };
    }

    // Create
    // @ts-expect-error
    data = await prisma[resource].create({
      data: await formattedFormData(
        formValues,
        dmmfSchema?.fields!,
        schema,
        resource,
        true,
        fields
      ),
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
