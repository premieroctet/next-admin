import { useRouterInternal } from "./useRouterInternal";
import { ModelAction, ModelName } from "../types";
import { useI18n } from "../context/I18nContext";

export const useAction = (resource: ModelName, ids: string[] | number[]) => {
  const { router } = useRouterInternal();
  const { t } = useI18n();

  const runAction = async (modelAction: ModelAction) => {
    try {
      await modelAction.action(resource, ids);
      if (modelAction.successMessage) {
        router.setQuery(
          {
            message: JSON.stringify({
              type: "success",
              content: t(modelAction.successMessage),
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
            error: t(modelAction.errorMessage),
            message: null,
          },
          true
        );
      }
    }
  };

  return { runAction };
};
