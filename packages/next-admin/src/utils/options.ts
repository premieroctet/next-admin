import type {
  CustomInputProps,
  Field,
  ModelName,
  NextAdminOptions,
} from "../types";

/**
 * Get the custom inputs for a model
 *
 * Used only for the create / edit page
 */
export const getCustomInputs = (
  model: ModelName,
  options?: NextAdminOptions
) => {
  const editFields = options?.model?.[model]?.edit?.fields;
  const customFields = options?.model?.[model]?.edit?.customFields;

  const inputs: Record<
    string,
    { input?: React.ReactElement<CustomInputProps> } | null
  > = {
    ...editFields,
    ...customFields,
  };

  return Object.keys(inputs ?? {}).reduce<
    Record<string, React.ReactElement<CustomInputProps>>
  >((acc, field) => {
    const input = inputs?.[field]?.input;
    if (input) {
      acc[field as Field<ModelName>] = input;
    }
    return acc;
  }, {});
};
