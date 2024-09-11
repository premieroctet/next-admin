import { useState } from "react";
import {
  buildQueryBlocks,
  buildUIBlocks,
  validateQuery,
} from "../utils/advancedSearch";
import { useRouterInternal } from "./useRouterInternal";
import { ModelName, Schema } from "../types";

type UseAdvancedSearchParams<M extends ModelName> = {
  resource: M;
  schema: Schema;
};

const useAdvancedSearch = <M extends ModelName>({
  resource,
  schema,
}: UseAdvancedSearchParams<M>) => {
  const { router, query } = useRouterInternal();
  const [uiBlocks, setUiBlocks] = useState(() => {
    if (query.q) {
      const blocks = validateQuery(query.q);

      if (!blocks) {
        return null;
      }

      return buildUIBlocks(blocks, { resource, schema });
    }
  });

  const submitSearch = () => {
    if (uiBlocks && uiBlocks.length) {
      router.setQuery({
        q: JSON.stringify(buildQueryBlocks(uiBlocks, { resource, schema })),
      });
    } else {
      router.setQuery({ q: null });
    }
  };

  return { uiBlocks, setUiBlocks, submitSearch };
};

export default useAdvancedSearch;
