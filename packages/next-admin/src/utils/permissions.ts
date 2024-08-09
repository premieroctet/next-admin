import { ModelName, ModelOptions, Permission } from "../types";

export const hasPermission = (
  modelOptions: ModelOptions<ModelName>[ModelName],
  permission: Permission
) => {
  return (
    !modelOptions?.permissions ||
    modelOptions?.permissions?.includes(permission)
  );
};
