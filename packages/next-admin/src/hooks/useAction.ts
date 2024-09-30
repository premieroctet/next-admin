import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import { useMessage } from "../context/MessageContext";
import { ClientAction, MessageData, ModelAction, ModelName } from "../types";
import { useRouterInternal } from "./useRouterInternal";

export const SPECIFIC_IDS_TO_RUN_ACTION = {
  DELETE: "__admin-delete",
};

export const useAction = <M extends ModelName>(
  resource: M,
  ids: string[] | number[]
) => {
  const { t } = useI18n();
  const { apiBasePath } = useConfig();
  const { showMessage } = useMessage();
  const { router } = useRouterInternal();

  const runAction = async (
    modelAction:
      | Exclude<ModelAction<M>, ClientAction<M>>
      | Omit<Exclude<ModelAction<M>, ClientAction<M>>, "action">
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
        router.refresh();

        const actionMessage = (await response.json()) as MessageData;
        if (actionMessage && actionMessage.message) {
          showMessage({
            type: actionMessage.type,
            message: t(actionMessage.message),
          });
          return;
        }

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
