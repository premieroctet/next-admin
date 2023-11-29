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

  const resourceId = getResourceIdFromParam(params[1], resource);

  const { __admin_action: action, ...formValues } =
    await getFormValuesFromFormData(formData);

  const dmmfSchema = getPrismaModelForResource(resource);
  const parsedFormData = parseFormData(formValues, dmmfSchema?.fields!);

  try {
    if (action === "delete") {
      if (resourceId !== undefined) {
        // @ts-expect-error
        await prisma[resource].delete({
          where: {
            id: resourceId,
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
          id: resourceId,
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

      return { updated: true };
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

    return { created: true, createdId: data.id };
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
