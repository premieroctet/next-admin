import { useState } from "react";
import {
  getQueryCondition,
  QueryBlock,
  QueryCondition,
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
  const [parsedQuery, setParsedQuery] = useState(() => {
    if (query.q) {
      const blocks = validateQuery(query.q);

      if (!blocks) {
        return null;
      }
    }
  });

  return { parsedQuery };
};

export default useAdvancedSearch;
