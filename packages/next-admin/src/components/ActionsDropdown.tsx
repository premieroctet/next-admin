import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ModelAction, ModelName } from "../types";
import {
  Dropdown,
  DropdownBody,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "./radix/Dropdown";
import { useAction } from "../hooks/useAction";

type Props = {
  actions: ModelAction[];
  selectedIds: string[] | number[];
  resource: ModelName;
  selectedCount?: number;
};

const ActionsDropdown = ({
  actions,
  selectedIds,
  resource,
  selectedCount,
}: Props) => {
  const { runAction } = useAction(resource, selectedIds);

  const onActionClick = (action: ModelAction) => {
    runAction(action);
  };

  return (
    <Dropdown>
      <DropdownTrigger
        asChild
        className="flex items-center gap-x-2 text-sm text-gray-700 rounded-md border border-input bg-transparent px-3 py-2"
        data-testid="actions-dropdown"
      >
        <button type="button">
          Action {(selectedCount ?? 0) > 1 ? `(${selectedCount})` : ""}
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </DropdownTrigger>
      <DropdownBody>
        <DropdownContent
          className="min-w-[10rem] p-2"
          sideOffset={4}
          data-testid="actions-dropdown-content"
        >
          {actions?.map((action) => {
            return (
              <DropdownItem
                key={action.title}
                className={clsx("rounded-md py-1 px-2", {
                  "text-red-600": action.style === "destructive",
                })}
                onClick={() => onActionClick(action)}
              >
                {action.title}
              </DropdownItem>
            );
          })}
        </DropdownContent>
      </DropdownBody>
    </Dropdown>
  );
};

export default ActionsDropdown;
