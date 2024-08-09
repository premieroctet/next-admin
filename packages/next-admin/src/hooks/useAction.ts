import { useRouterInternal } from "./useRouterInternal";
import { ModelAction, ModelName } from "../types";
import { useI18n } from "../context/I18nContext";
import { useConfig } from "../context/ConfigContext";
import { useMessage } from "../context/MessageContext";

export const SPECIFIC_IDS_TO_RUN_ACTION = {
  DELETE: "__admin-delete",
};

export const useAction = (resource: ModelName, ids: string[] | number[]) => {
  const { router } = useRouterInternal();
  const { t } = useI18n();
  const { apiBasePath } = useConfig();
  const { showMessage } = useMessage();

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
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error();
        }
      }

      if (modelAction.successMessage) {
        showMessage({
          type: "success",
          message: t(modelAction.successMessage),
        });
      }
    } catch {
      if (modelAction.errorMessage) {
        showMessage({
          type: "error",
          message: t(modelAction.errorMessage),
        });
      }
    }
  };

  return { runAction };
};
