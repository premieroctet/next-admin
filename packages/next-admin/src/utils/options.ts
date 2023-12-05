import { Field, ModelName, NextAdminOptions } from "../types";

/**
 * Get the custom inputs for a model
 *
 * Used only for the create / edit page
 */
export const getCustomInputs = (
  model: ModelName,
  options: NextAdminOptions
) => {
  const editFields = options.model?.[model]?.edit?.fields;

  return Object.keys(editFields ?? {}).reduce((acc, field) => {
    const input = editFields?.[field as keyof typeof editFields]?.input;
    if (input) {
      acc[field as Field<ModelName>] = input;
    }
    return acc;
  }, {} as Record<Field<ModelName>, React.ReactElement | undefined>);
};
