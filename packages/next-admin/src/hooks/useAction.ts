import { useRouterInternal } from "./useRouterInternal";
import { ModelAction, ModelName } from "../types";
import { useI18n } from "../context/I18nContext";
import { useConfig } from "../context/ConfigContext";

export const SPECIFIC_IDS_TO_RUN_ACTION = {
  DELETE: "__admin-delete",
};

export const useAction = (resource: ModelName, ids: string[] | number[]) => {
  const { router } = useRouterInternal();
  const { t } = useI18n();
  const { apiBasePath } = useConfig();

  const runAction = async (
    modelAction: ModelAction | Omit<ModelAction, "action">
  ) => {
    try {
      if (
        Object.values(SPECIFIC_IDS_TO_RUN_ACTION).includes(modelAction.id) &&
        "action" in modelAction
      ) {
        await modelAction.action(ids);
      } else {
        const response = await fetch(
          `${apiBasePath}/${resource}/actions/${modelAction.id}`,
          {
            method: "POST",
            body: JSON.stringify(ids),
          }
        );

        if (!response.ok) {
          throw new Error();
        }
      }

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
