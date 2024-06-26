import { Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { Fragment, useState } from "react";
import { useI18n } from "../context/I18nContext";
import { ListExport } from "../types";
import {
  Dropdown,
  DropdownBody,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "./radix/Dropdown";

type Props = {
  exports: ListExport[];
};

const ExportDropdown = ({ exports }: Props) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown onOpenChange={setIsOpen}>
      <DropdownTrigger
        asChild
        className="text-nextadmin-content-inverted dark:text-dark-nextadmin-brand-inverted border-nextadmin-border-default dark:border-dark-nextadmin-border-default dark:bg-dark-nextadmin-background-subtle flex items-center gap-x-2 rounded-md border bg-transparent px-3 py-2 text-sm"
        data-testid="actions-dropdown"
      >
        <button type="button">
          <div className="flex gap-1">
            <span className="hidden md:block">{t("export.label")}</span>
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
            {exports?.map(({ format, url }) => {
              return (
                <DropdownItem
                  key={format}
                  className={clsx("cursor-pointer rounded-md px-2 py-1")}
                >
                  <Link prefetch={false} href={url} target="_blank">
                    {t("list.row.actions.export", { format: format })}
                  </Link>
                </DropdownItem>
              );
            })}
          </Transition.Child>
        </Transition.Root>
      </DropdownBody>
    </Dropdown>
  );
};

export default ExportDropdown;
