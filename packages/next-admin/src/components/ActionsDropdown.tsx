import { Transition, TransitionChild } from "@headlessui/react";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useI18n } from "../context/I18nContext";
import { ModelName, OutputModelAction } from "../types";
import ActionDropdownItem from "./ActionDropdownItem";
import {
  Dropdown,
  DropdownBody,
  DropdownContent,
  DropdownTrigger,
} from "./radix/Dropdown";

type Props = {
  actions: OutputModelAction;
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
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown onOpenChange={setIsOpen}>
      <DropdownTrigger
        asChild
        className="text-nextadmin-content-inverted dark:text-dark-nextadmin-brand-inverted border-nextadmin-border-default dark:border-dark-nextadmin-border-default dark:bg-dark-nextadmin-background-subtle flex min-w-fit items-center gap-x-2 rounded-md border bg-transparent px-3 py-2 text-sm"
        data-testid="actions-dropdown"
      >
        <button type="button">
          <div className="flex gap-1">
            <span className="hidden md:block">
              {t("actions.label")}{" "}
              {(selectedCount ?? 0) > 1 ? `(${selectedCount})` : ""}
            </span>
            <ChevronDownIcon
              className="hidden h-5 w-5 md:block"
              aria-hidden="true"
            />
            <EllipsisVerticalIcon
              className="block h-5 w-5 md:hidden"
              aria-hidden="true"
            />
          </div>
        </button>
      </DropdownTrigger>
      <DropdownBody forceMount>
        <Transition show={isOpen}>
          <TransitionChild
            as={DropdownContent}
            className="min-w-[10rem] p-2"
            sideOffset={4}
            data-testid="actions-dropdown-content"
            enter="transition-all ease-out"
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-1"
          >
            {actions?.map((action) => {
              return (
                <ActionDropdownItem
                  key={action.id}
                  action={action}
                  resourceIds={selectedIds}
                  resource={resource}
                />
              );
            })}
          </TransitionChild>
        </Transition>
      </DropdownBody>
    </Dropdown>
  );
};

export default ActionsDropdown;
