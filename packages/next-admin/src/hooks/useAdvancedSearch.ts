import { useState } from "react";
import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import { ModelName, Schema } from "../types";
import {
  buildQueryBlocks,
  buildUIBlocks,
  validateQuery,
} from "../utils/advancedSearch";
import { useRouterInternal } from "./useRouterInternal";

type UseAdvancedSearchParams<M extends ModelName> = {
  resource: M;
  schema: Schema;
};

const useAdvancedSearch = <M extends ModelName>({
  resource,
  schema,
}: UseAdvancedSearchParams<M>) => {
  const { router, query } = useRouterInternal();
  const { options } = useConfig();
  const { t } = useI18n();
  const [uiBlocks, setUiBlocks] = useState(() => {
    if (query.q) {
      const blocks = validateQuery(query.q);

      if (!blocks) {
        return null;
      }

      return buildUIBlocks(blocks, {
        resource,
        schema,
        options: options?.model,
        t,
      });
    }
  });

  const submitSearch = () => {
    if (uiBlocks?.length) {
      router.setQuery(
        {
          q: JSON.stringify(buildQueryBlocks(uiBlocks, { resource, schema })),
        },
        true
      );
    } else {
      router.setQuery({ q: null }, true);
    }
  };

  return { uiBlocks, setUiBlocks, submitSearch };
};

export default useAdvancedSearch;
