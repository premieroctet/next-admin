import { useState } from "react";
import {
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

  return { uiBlocks, setUiBlocks };
};

export default useAdvancedSearch;
