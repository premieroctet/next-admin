// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Transition, TransitionChild } from "@headlessui/react";
import { SortableTree } from "dnd-kit-sortable-tree";
import unset from "lodash.unset";
import update from "lodash.update";
import { Fragment, useCallback, useMemo } from "react";
import { useI18n } from "../../context/I18nContext";
import useAdvancedSearch from "../../hooks/useAdvancedSearch";
import { ModelName, Schema } from "../../types";
import {
  cleanEmptyBlocks,
  setInternalPathToBlocks,
  UIQueryBlock,
} from "../../utils/advancedSearch";
import Button from "../radix/Button";
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "../radix/Dialog";
import { AdvancedSearchContext } from "./AdvancedSearchContext";
import AdvancedSearchDropdown from "./AdvancedSearchDropdown";
import AdvancedSearchTree from "./AdvancedSearchTreeItem";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  resource: ModelName;
  schema: Schema;
};

const AdvancedSearchModal = ({ isOpen, onClose, resource, schema }: Props) => {
  const { uiBlocks, setUiBlocks, submitSearch } = useAdvancedSearch({
    resource,
    schema,
  });
  const { t } = useI18n();

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

  const onClear = () => {
    setUiBlocks(null);
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      modal
    >
      <DialogPortal forceMount>
        <Transition show={isOpen} as="div">
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            leave="transition-opacity ease-in-out duration-300"
          >
            <DialogOverlay forceMount />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            leave="transition-opacity ease-in-out duration-300"
          >
            <DialogContent
              forceMount
              className="max-w-xl md:left-[50%] md:top-[50%]"
            >
              <div className="flex flex-col gap-4">
                <DialogTitle>{t("search.advanced.title")}</DialogTitle>
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
                  <div className="flex justify-between">
                    <Button variant="destructiveOutline" onClick={onClear}>
                      {t("search.advanced.clear")}
                    </Button>
                    <div className="flex justify-end gap-4">
                      <Button variant="ghost" onClick={onClose}>
                        {t("search.advanced.cancel")}
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => {
                          submitSearch();
                          onClose();
                        }}
                      >
                        {t("search.advanced.save")}
                      </Button>
                    </div>
                  </div>
                </AdvancedSearchContext.Provider>
              </div>
            </DialogContent>
          </TransitionChild>
        </Transition>
      </DialogPortal>
    </DialogRoot>
  );
};

export default AdvancedSearchModal;
