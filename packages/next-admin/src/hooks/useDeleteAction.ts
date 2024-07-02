import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import { useMessage } from "../context/MessageContext";
import { ModelName } from "../types";
import { slugify } from "../utils/tools";
import { useRouterInternal } from "./useRouterInternal";

export const useDeleteAction = (resource: ModelName) => {
  const { apiBasePath } = useConfig();
  const { router } = useRouterInternal();
  const { t } = useI18n();
  const { showMessage } = useMessage();

  const runDeletion = async (ids: string[] | number[]) => {
    const response = await fetch(`${apiBasePath}/${slugify(resource)}`, {
      method: "DELETE",
      body: JSON.stringify(ids),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error);
    }
  };

  const deleteItems = async (ids: string[] | number[]) => {
    if (
      window.confirm(t("list.row.actions.delete.alert", { count: ids.length }))
    ) {
      try {
        await runDeletion(ids);
        showMessage({
          type: "success",
          message: t("list.row.actions.delete.success"),
        });
        router.refresh();
      } catch {
        showMessage({
          type: "error",
          message: t("list.row.actions.delete.error"),
        });
      }
    }
  };

  return { deleteItems, runDeletion };
};
