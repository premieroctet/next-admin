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
import Button from "./radix/Button";

type Props = {
  actions: ModelAction[];
  selectedIds: string[] | number[];
  resource: ModelName;
  selectedCount?: number;
  trigger?: React.ReactNode;
};

const ActionsDropdown = ({
  actions,
  selectedIds,
  resource,
  selectedCount,
  trigger,
}: Props) => {
  const { runAction } = useAction(resource, selectedIds);

  const onActionClick = (action: ModelAction) => {
    runAction(action);
  };

  return (
    <Dropdown>
      {trigger || (
        <DropdownTrigger
          asChild
          className="flex items-center gap-x-2 text-sm"
          data-testid="actions-dropdown"
        >
          <Button type="button" variant="secondary" size="sm">
            Action {(selectedCount ?? 0) > 1 ? `(${selectedCount})` : ""}
            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
          </Button>
        </DropdownTrigger>
      )}
      <DropdownBody>
        <DropdownContent
          className="min-w-[10rem] p-2 max-w-[20rem]"
          sideOffset={4}
          data-testid="actions-dropdown-content"
          align="end"
        >
          {actions?.map((action) => {
            return (
              <DropdownItem
                key={action.title}
                className={clsx("rounded-md py-1 px-2", {
                  "text-red-600": action.style === "destructive",
                })}
                onClick={(evt) => {
                  evt.stopPropagation();
                  onActionClick(action);
                }}
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
