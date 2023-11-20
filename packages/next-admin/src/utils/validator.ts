import {
  EditFieldsOptions,
  ModelName,
  ModelWithoutRelationships,
} from "../types";
import {
  PropertyValidationError,
  ValidationError,
} from "../exceptions/ValidationError";

export const validate = <M extends ModelName>(
  formData: Partial<ModelWithoutRelationships<M>>,
  fieldsOptions?: EditFieldsOptions<M>
) => {
  if (!fieldsOptions) {
    return;
  }

  const errors: PropertyValidationError[] = [];
  let property: keyof typeof fieldsOptions;
  for (property in fieldsOptions) {
    if (fieldsOptions[property]?.validate && formData[property]) {
      const validation = fieldsOptions[property]!.validate!(
        // @ts-ignore
        formData[property]
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
};
