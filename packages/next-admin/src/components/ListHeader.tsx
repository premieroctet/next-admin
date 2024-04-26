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
import {
  ModelAction,
  ModelIcon,
  ModelName,
  Permission,
  PermissionType,
} from "../types";
import { slugify } from "../utils/tools";
import ActionsDropdown from "./ActionsDropdown";
import Breadcrumb from "./Breadcrumb";
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
  icon?: ModelIcon;
  totalCount?: number;
  canCreate?: boolean;
  canDelete?: boolean;
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
  const { basePath, options } = useConfig();
  const { t } = useI18n();

  const hasPermission = (permission: PermissionType) =>
    !modelOptions?.permissions ||
    modelOptions?.permissions?.includes(permission);

  const modelOptions = options?.model?.[resource];
  const canCreate = hasPermission(Permission.CREATE);
  const canDelete = hasPermission(Permission.DELETE);

  const selectedRowsCount = Object.keys(selectedRows).length;

  const actions = useMemo<ModelAction[]>(() => {
    const defaultActions: ModelAction[] = canDelete
      ? [
          {
            title: t("actions.delete.label"),
            style: "destructive",
            action: async () => {
              await onDelete();
            },
          },
        ]
      : [];

    return [...(actionsProp || []), ...defaultActions];
  }, [actionsProp, onDelete, t]);

  return (
    <>
      <div className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default dark:border-b-dark-nextadmin-border-default border-b-nextadmin-border-default sticky top-0 z-10 flex h-auto flex-col items-start justify-between gap-3 border-b px-4 py-4 shadow-sm sm:flex-row sm:items-center md:h-16 md:py-0">
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
        <div className="flex w-full items-center justify-between gap-x-4 sm:w-auto">
          {(totalCount || 0 > 1 || (search && totalCount) || 0 > 1) && (
            <span className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default hidden text-sm sm:block">
              {search
                ? t("list.header.search.result_filtered", { count: totalCount })
                : t("list.header.search.result", {
                    count: totalCount,
                  })}
            </span>
          )}
          {onSearchChange && (
            <div className="bg-nextadmin-background-subtle dark:bg-dark-nextadmin-background-subtle ring-nextadmin-border-strong dark:ring-dark-nextadmin-border-strong flex items-center justify-end gap-2 rounded-md px-3 py-1 ring-1 ">
              <input
                id="search"
                name="search"
                onInput={onSearchChange}
                defaultValue={search}
                type="search"
                className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle rounded-md bg-[transparent] py-1.5 text-sm focus:outline-none focus:ring-0 focus:ring-offset-0"
                placeholder={`${t(
                  "list.header.search.placeholder"
                )} ${title?.toLowerCase()}`}
              />
              <label htmlFor="search">
                {isPending ? (
                  <Loader className="stroke-nextadmin-content-default dark:stroke-dark-nextadmin-content-default h-6 w-6 animate-spin dark:stroke-gray-300" />
                ) : (
                  <MagnifyingGlassIcon
                    className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-6 w-6"
                    aria-hidden="true"
                  />
                )}
              </label>
            </div>
          )}
          {Boolean(selectedRowsCount) && !!actions.length && (
            <ActionsDropdown
              actions={actions}
              resource={resource}
              selectedIds={getSelectedRowsIds()}
              selectedCount={selectedRowsCount}
            />
          )}
          {canCreate && (
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
              <PlusSmallIcon className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
