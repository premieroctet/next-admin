import { Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useI18n } from "../context/I18nContext";
import { useAction } from "../hooks/useAction";
import { ModelAction, ModelName } from "../types";
import {
  Dropdown,
  DropdownBody,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "./radix/Dropdown";

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
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const onActionClick = (action: ModelAction) => {
    runAction(action);
  };

  return (
    <Dropdown onOpenChange={setIsOpen}>
      <DropdownTrigger
        asChild
        className="flex items-center gap-x-2 text-sm text-gray-700 rounded-md border border-input bg-transparent px-3 py-2"
        data-testid="actions-dropdown"
      >
        <button type="button">
          {t("actions.label")}{" "}
          {(selectedCount ?? 0) > 1 ? `(${selectedCount})` : ""}
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </DropdownTrigger>
      <DropdownBody forceMount>
        <Transition.Root as={Fragment} show={isOpen}>
          <Transition.Child
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
                <DropdownItem
                  key={action.title}
                  className={clsx("rounded-md py-1 px-2 cursor-pointer", {
                    "text-red-700": action.style === "destructive",
                    "hover:bg-red-50": action.style === "destructive",
                  })}
                  onClick={() => onActionClick(action)}
                >
                  {t(action.title)}
                </DropdownItem>
              );
            })}
          </Transition.Child>
        </Transition.Root>
      </DropdownBody>
    </Dropdown>
  );
};

export default ActionsDropdown;
