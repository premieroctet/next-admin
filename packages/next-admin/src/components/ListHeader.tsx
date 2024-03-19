import {
  MagnifyingGlassIcon,
  PlusSmallIcon,
} from "@heroicons/react/24/outline";
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
  title: string;
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
  title,
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
    <>
      <div className="flex justify-between sm:items-center mb-6 flex-col sm:flex-row items-start gap-4">
        <h1 className="font-semibold leading-7 text-slate-800 sm:truncate text-3xl sm:tracking-tight py-3">
          {title}
        </h1>
        <div className="flex items-center justify-between gap-x-4 w-full sm:w-auto">
          {onSearchChange && (
            <div className="flex justify-end items-center gap-2 bg-slate-100 border-gray-300 px-3 py-1 rounded-xl">
              <label htmlFor="search">
                {isPending ? (
                  <Loader className="h-6 w-6 stroke-gray-400 animate-spin" />
                ) : (
                  <MagnifyingGlassIcon
                    className="h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </label>
              <input
                id="search"
                name="search"
                onInput={onSearchChange}
                defaultValue={search}
                type="search"
                className="bg-transparent py-1.5 rounded-md text-sm focus:outline-none focus:ring-0 focus:ring-offset-0"
                placeholder={`${t(
                  "list.header.search.placeholder"
                )} ${title?.toLowerCase()}`}
              />
            </div>
          )}
          {Boolean(selectedRowsCount) && (
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
            <PlusSmallIcon className="h-5 w-5 ml-2" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
