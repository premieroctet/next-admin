import { useConfig } from "../context/ConfigContext";
import { ModelAction, ModelName } from "../types";
import { slugify } from "../utils/tools";
import { useRouterInternal } from "./useRouterInternal";

export const useDeleteAction = (
  resource: ModelName,
  action?: ModelAction["action"]
) => {
  const { isAppDir, basePath } = useConfig();
  const { router } = useRouterInternal();

  const deleteItems = async (ids: string[] | number[]) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${ids.length} row${
          ids.length === 1 ? "" : "s"
        }?`
      )
    ) {
      try {
        if (isAppDir) {
          await action?.(resource, ids);
        } else {
          const response = await fetch(`${basePath}/${slugify(resource)}`, {
            method: "DELETE",
            body: JSON.stringify(ids),
          });

          if (!response.ok) {
            throw new Error();
          }
        }
        router.setQuery(
          {
            message: JSON.stringify({
              type: "success",
              content: "Deleted successfully",
            }),
          },
          true
        );
      } catch {
        router.setQuery(
          {
            error: "An error occured while deleting",
          },
          true
        );
      }
    }
  };

  return { deleteItems };
};
