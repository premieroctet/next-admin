import { useRouterInternal } from "./useRouterInternal";
import { ModelAction, ModelName } from "../types";

export const useAction = (resource: ModelName, ids: string[] | number[]) => {
  const { router } = useRouterInternal();

  const runAction = async (modelAction: ModelAction) => {
    try {
      await modelAction.action(resource, ids);
      if (modelAction.successMessage) {
        router.setQuery(
          {
            message: JSON.stringify({
              type: "success",
              content: modelAction.successMessage,
            }),
            error: null,
          },
          true
        );
      }
    } catch {
      if (modelAction.errorMessage) {
        router.setQuery(
          {
            error: modelAction.errorMessage,
            message: null,
          },
          true
        );
      }
    }
  };

  return { runAction };
};
