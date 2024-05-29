import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import { ModelAction, ModelName } from "../types";
import { slugify } from "../utils/tools";
import { useRouterInternal } from "./useRouterInternal";

export const useDeleteAction = (resource: ModelName) => {
  const { apiBasePath } = useConfig();
  const { router } = useRouterInternal();
  const { t } = useI18n();

  const runDeletion = async (ids: string[] | number[]) => {
    const response = await fetch(`${apiBasePath}/${slugify(resource)}`, {
      method: "DELETE",
      body: JSON.stringify(ids),
    });

    if (!response.ok) {
      throw new Error();
    }
  };

  const deleteItems = async (ids: string[] | number[]) => {
    if (
      window.confirm(t("list.row.actions.delete.alert", { count: ids.length }))
    ) {
      try {
        await runDeletion(ids);
        router.setQuery(
          {
            message: JSON.stringify({
              type: "success",
              content: t("list.row.actions.delete.success"),
            }),
          },
          true
        );
      } catch {
        router.setQuery(
          {
            error: t("list.row.actions.delete.error"),
          },
          true
        );
      }
    }
  };

  return { deleteItems, runDeletion };
};
