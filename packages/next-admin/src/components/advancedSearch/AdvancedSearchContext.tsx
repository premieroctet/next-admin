import { createContext, useContext } from "react";
import { ModelName, Schema } from "../../types";
import { UIQueryBlock } from "../../utils/advancedSearch";

type AdvancedSearchContextType = {
  addUiBlock: (uiBlock: UIQueryBlock) => void;
  removeUiBlock: (path: string) => void;
  updateUiBlock: (uiBlock: UIQueryBlock) => void;
  resource: ModelName;
  schema: Schema;
};

export const AdvancedSearchContext = createContext<AdvancedSearchContextType>({
  addUiBlock: () => {},
  removeUiBlock: () => {},
  updateUiBlock: () => {},
  resource: "" as ModelName,
  schema: {} as Schema,
});

export const useAdvancedSearchContext = () => {
  return useContext(AdvancedSearchContext);
};
