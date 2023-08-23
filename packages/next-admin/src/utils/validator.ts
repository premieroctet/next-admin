import { Prisma } from "@prisma/client";
import { EditFieldsOptions } from "../types";
import {
  PropertyValidationError,
  ValidationError,
} from "../exceptions/ValidationError";

export default function validate<ModelName extends Prisma.ModelName>(
  formData: { [key: string]: string },
  fieldsOptions?: EditFieldsOptions<ModelName>
) {
  if (!fieldsOptions) {
    return;
  }

  const errors: PropertyValidationError[] = [];
  let property: keyof typeof fieldsOptions;
  for (property in fieldsOptions) {
    if (fieldsOptions[property]?.validate) {
      const validation = fieldsOptions[property]!.validate!(
        formData[property as string]
      );

      if (validation !== true) {
        errors.push({
          property,
          message: validation,
        });
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError("Validation error", errors);
  }
}
