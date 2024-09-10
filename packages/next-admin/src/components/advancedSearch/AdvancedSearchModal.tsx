import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { SortableTree } from "dnd-kit-sortable-tree";
import { useCallback, useMemo } from "react";
import unset from "lodash.unset";
import { ModelName, Schema } from "../../types";
import useAdvancedSearch from "../../hooks/useAdvancedSearch";
import AdvancedSearchTree from "./AdvancedSearchTreeItem";
import AdvancedSearchDropdown from "./AdvancedSearchDropdown";
import {
  cleanEmptyBlocks,
  setInternalPathToBlocks,
  UIQueryBlock,
} from "../../utils/advancedSearch";
import { AdvancedSearchContext } from "./AdvancedSearchContext";
import update from "lodash.update";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  resource: ModelName;
  schema: Schema;
};

const AdvancedSearchModal = ({ isOpen, onClose, resource, schema }: Props) => {
  const { uiBlocks, setUiBlocks } = useAdvancedSearch({ resource, schema });

  const addUiBlock = useCallback(
    (uiBlock: UIQueryBlock) => {
      setUiBlocks((prev) => {
        const newBlocks = prev ? prev.slice() : [];

        newBlocks.push(uiBlock);
        setInternalPathToBlocks(newBlocks);

        return newBlocks;
      });
    },
    [setUiBlocks]
  );

  const removeUiBlock = useCallback(
    (path: string) => {
      setUiBlocks((prev) => {
        if (!prev) {
          return prev;
        }

        const newBlocks = prev.slice();
        unset(newBlocks, path);
        cleanEmptyBlocks(newBlocks);
        setInternalPathToBlocks(newBlocks);

        return newBlocks;
      });
    },
    [setUiBlocks]
  );

  const updateUiBlock = useCallback(
    (uiBlock: UIQueryBlock) => {
      setUiBlocks((prev) => {
        if (!prev) {
          return prev;
        }

        const newBlocks = prev.slice();
        update(newBlocks, uiBlock.internalPath!, () => uiBlock);

        return newBlocks;
      });
    },
    [setUiBlocks]
  );

  const contextValue = useMemo(
    () => ({
      addUiBlock,
      removeUiBlock,
      updateUiBlock,
      resource,
      schema,
    }),
    [addUiBlock, removeUiBlock, updateUiBlock, resource, schema]
  );

  console.log("uiBlocks", uiBlocks);

  return (
    <Dialog
      as="div"
      open={isOpen}
      className="relative z-50 transition duration-300 ease-in-out"
      onClose={onClose}
      transition
    >
      <DialogBackdrop
        transition
        className="z-999 bg-nextadmin-background-default/70 dark:bg-dark-nextadmin-background-default/70 fixed inset-0 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel
          className="bg-nextadmin-background-emphasis dark:bg-dark-nextadmin-background-emphasis w-full max-w-xl rounded-xl p-4 shadow-sm duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          transition
        >
          <div className="flex flex-col gap-4">
            <AdvancedSearchContext.Provider value={contextValue}>
              {uiBlocks && (
                <SortableTree<UIQueryBlock>
                  items={uiBlocks}
                  onItemsChanged={(items, reason) => {
                    const newItems = items.slice();
                    setInternalPathToBlocks(newItems);
                    setUiBlocks(newItems);
                  }}
                  TreeItemComponent={AdvancedSearchTree}
                />
              )}
              <AdvancedSearchDropdown
                resource={resource}
                schema={schema}
                onAddBlock={addUiBlock}
              />
            </AdvancedSearchContext.Provider>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AdvancedSearchModal;
