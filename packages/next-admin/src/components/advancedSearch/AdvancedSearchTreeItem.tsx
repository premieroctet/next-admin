import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  SimpleTreeItemWrapper,
  TreeItemComponentProps,
} from "dnd-kit-sortable-tree";
import { forwardRef, MouseEvent } from "react";
import { UIQueryBlock } from "../../utils/advancedSearch";
import Button from "../radix/Button";
import { useAdvancedSearchContext } from "./AdvancedSearchContext";
import AdvancedSearchDropdown from "./AdvancedSearchDropdown";
import AdvancedSearchFieldCondition from "./AdvancedSearchFieldCondition";
import AdvancedSearchInput from "./AdvancedSearchInput";

type Props = TreeItemComponentProps<UIQueryBlock>;

const AdvancedSearchTree = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { updateUiBlock, removeUiBlock, resource, schema } =
    useAdvancedSearchContext();

  const onSwitchBranchType = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    updateUiBlock({
      ...props.item,
      type: props.item.type === "and" ? "or" : "and",
    });
  };

  const onRemove = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    removeUiBlock(props.item.internalPath!);
  };

  return (
    <SimpleTreeItemWrapper
      {...props}
      showDragHandle={false}
      hideCollapseButton
      ref={ref}
      disableCollapseOnItemClick
      className="flex max-w-full flex-col"
      contentClassName="max-w-full text-nextadmin-content-default dark:text-dark-nextadmin-content-default bg-nextadmin-background-muted dark:bg-dark-nextadmin-background-emphasis relative flex cursor-default gap-2 rounded-md !px-3 !py-1 text-sm !border-none"
    >
      <div className="flex max-w-full flex-1 items-center gap-2">
        <div {...props.handleProps}>
          <Bars2Icon className="h-4 w-4 cursor-grab" />
        </div>
        {props.item.type === "filter" && (
          <AdvancedSearchDropdown
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="block max-w-[100px] overflow-x-hidden truncate text-left md:max-w-[200px]"
                title={props.item.displayPath}
              >
                {props.item.displayPath}
              </Button>
            }
            resource={resource}
            schema={schema}
            showBranching={false}
            onAddBlock={(uiBlock) => {
              updateUiBlock({
                ...uiBlock,
                internalPath: props.item.internalPath,
              });
            }}
          />
        )}
        {props.item.type !== "filter" && (
          <Button variant="ghost" size="sm" onClick={onSwitchBranchType}>
            {props.item.type === "and" ? "AND" : "OR"}
          </Button>
        )}
        <AdvancedSearchFieldCondition uiBlock={props.item} />
        <AdvancedSearchInput uiBlock={props.item} />
      </div>
      <Button variant="ghost" size="sm" onClick={onRemove}>
        <XMarkIcon className="h-4 w-4" />
      </Button>
    </SimpleTreeItemWrapper>
  );
});

export default AdvancedSearchTree;
