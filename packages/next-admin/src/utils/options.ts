import { Field, ModelName, NextAdminOptions } from "../types";

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

  const inputs: Record<string, { input?: React.ReactElement }> = {
    ...editFields,
    ...customFields,
  };

  return Object.keys(inputs ?? {}).reduce<
    Record<string, React.ReactElement | undefined>
  >((acc, field) => {
    const input = inputs?.[field]?.input;
    if (input) {
      acc[field as Field<ModelName>] = input;
    }
    return acc;
  }, {});
};

export const getClientActionDialogs = (
  model: ModelName,
  options?: NextAdminOptions
) => {
  const actions = options?.model?.[model]?.actions;
  const actionsMap: Record<string, React.ReactElement> = {};

  actions?.forEach((action) => {
    if (
      "component" in action &&
      "type" in action &&
      action.type === "dialog" &&
      action.component
    ) {
      actionsMap[action.id] = action.component;
    }
  });

  return actionsMap;
};
