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
import { UIQueryBlock } from "../../utils/advancedSearch";
import { useI18n } from "../../context/I18nContext";

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
  const { t } = useI18n();

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            className="dark:border-dark-nextadmin-border-strong justify-between gap-2 border"
          >
            <div className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
              {t("search.advanced.add")}
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
                {t("search.advanced.and_or_group")}
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
