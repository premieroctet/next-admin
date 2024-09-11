import AdvancedSearchDropdownItem from "./AdvancedSearchDropdownItem";
import { ModelName, Schema } from "../../types";
import {
  Dropdown,
  DropdownBody,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from "../radix/Dropdown";
import Button from "../radix/Button";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import Divider from "../Divider";
import { UIQueryBlock } from "../../utils/advancedSearch";

type Props = {
  resource: ModelName;
  schema: Schema;
  onAddBlock: (uiBlock: UIQueryBlock) => void;
  showBranching?: boolean;
  trigger?: React.ReactNode;
};

const AdvancedSearchDropdown = ({
  resource,
  schema,
  onAddBlock,
  showBranching = true,
  trigger,
}: Props) => {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="justify-between gap-2">
            <div className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
              Add a filter
            </div>
            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </DropdownTrigger>
      <DropdownBody>
        <DropdownContent
          className="z-[999] max-h-[300px] w-[max(var(--radix-dropdown-menu-trigger-width),_300px)] overflow-y-auto p-2"
          avoidCollisions
          sideOffset={4}
          align="start"
        >
          {showBranching && (
            <>
              <DropdownItem
                className="cursor-pointer rounded-md p-2"
                onClick={() => {
                  onAddBlock({
                    type: "and",
                    children: [],
                    id: crypto.randomUUID(),
                  });
                }}
              >
                AND / OR group
              </DropdownItem>
              <DropdownSeparator className="my-0.5" />
            </>
          )}
          {Object.keys(schema.definitions[resource].properties).map(
            (property) => {
              return (
                <AdvancedSearchDropdownItem
                  key={property}
                  property={property}
                  schema={schema}
                  resource={resource}
                  onAddBlock={onAddBlock}
                />
              );
            }
          )}
        </DropdownContent>
      </DropdownBody>
    </Dropdown>
  );
};

export default AdvancedSearchDropdown;
