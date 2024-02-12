import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { RowSelectionState } from "@tanstack/react-table";
import Link from "next/link";
import { ChangeEvent, useMemo } from "react";
import Loader from "../assets/icons/Loader";
import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import { ModelAction, ModelName } from "../types";
import ActionsDropdown from "./ActionsDropdown";
import { buttonVariants } from "./radix/Button";

type Props = {
  resource: ModelName;
  isPending: boolean;
  onSearchChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  search: string;
  actions?: ModelAction[];
  selectedRows: RowSelectionState;
  getSelectedRowsIds: () => string[] | number[];
  onDelete: () => Promise<void>;
};

export default function ListHeader({
  resource,
  isPending,
  onSearchChange,
  search,
  actions: actionsProp,
  selectedRows,
  getSelectedRowsIds,
  onDelete,
}: Props) {
  const { basePath } = useConfig();
  const { t } = useI18n();

  const selectedRowsCount = Object.keys(selectedRows).length;

  const actions = useMemo<ModelAction[]>(() => {
    const defaultActions: ModelAction[] = [
      {
        title: t("actions.delete.label"),
        style: "destructive",
        action: async () => {
          await onDelete();
        },
      },
    ];

    return [...(actionsProp || []), ...defaultActions];
  }, [actionsProp, onDelete, t]);

  return (
    <div className="flex justify-between items-end">
      <div>
        {onSearchChange && <div className="mt-4 flex justify-end items-center gap-2">
          {isPending ? (
            <Loader className="h-6 w-6 stroke-gray-400 animate-spin" />
          ) : (
            <MagnifyingGlassIcon
              className="h-6 w-6 text-gray-400"
              aria-hidden="true"
            />
          )}
          <input
            name="search"
            onInput={onSearchChange}
            defaultValue={search}
            type="search"
            className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus-visible:outline focus-visible:outline-indigo-500 focus-visible:ring focus-visible:ring-indigo-500"
            placeholder={t("list.header.search.placeholder")}
          />
        </div>}
      </div>
      <div className="flex items-center gap-x-4">
        {!!selectedRowsCount && (
          <ActionsDropdown
            actions={actions}
            resource={resource}
            selectedIds={getSelectedRowsIds()}
            selectedCount={selectedRowsCount}
          />
        )}
        <Link
          href={`${basePath}/${resource}/new`}
          role="button"
          className={buttonVariants({
            variant: "default",
            size: "sm",
          })}
        >
          <span>{t("list.header.add.label")}</span>
          <PlusIcon className="h-5 w-5 ml-2" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
