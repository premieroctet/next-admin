"use client";

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
import { ModelAction, ModelIcon, ModelName } from "../types";
import ActionsDropdown from "./ActionsDropdown";
import Breadcrumb from "./Breadcrumb";
import { buttonVariants } from "./radix/Button";
import { slugify } from "../utils/tools";

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
  icon?: ModelIcon;
  totalCount?: number;
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
  icon,
  totalCount,
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
      <div className="h-auto md:h-16 py-4 md:py-0 flex justify-between sm:items-center flex-col sm:flex-row items-start gap-3 px-4 sticky top-0 z-10 bg-white border-b border-b-slate-200 shadow-sm">
        <Breadcrumb
          breadcrumbItems={[
            {
              label: title,
              href: `${basePath}/${slugify(resource)}`,
              current: true,
              icon,
            },
          ]}
        />
        <div className="flex items-center justify-between gap-x-4 w-full sm:w-auto">
          {(totalCount || 0 > 1 || (search && totalCount) || 0 > 1) && (
            <span className="text-gray-400 text-sm hidden sm:block">
              {search
                ? t("list.header.search.result_filtered", { count: totalCount })
                : t("list.header.search.result", {
                    count: totalCount,
                  })}
            </span>
          )}
          {onSearchChange && (
            <div className="flex justify-end items-center gap-2 bg-slate-100 border-gray-300 px-3 py-1 rounded-md">
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
            href={`${basePath}/${slugify(resource)}/new`}
            role="button"
            data-testid="add-new-button"
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
