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
import { SPECIFIC_IDS_TO_RUN_ACTION } from "../hooks/useAction";
import {
  AdminComponentProps,
  ModelAction,
  ModelIcon,
  ModelName,
  Permission,
  PermissionType,
} from "../types";
import { slugify } from "../utils/tools";
import ActionsDropdown from "./ActionsDropdown";
import Breadcrumb from "./Breadcrumb";
import ExportDropdown from "./ExportDropdown";
import { buttonVariants } from "./radix/Button";

type Props = {
  resource: ModelName;
  isPending: boolean;
  onSearchChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  search: string;
  actions?: AdminComponentProps["actions"];
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
  const { basePath, options } = useConfig();
  const { t } = useI18n();

  const hasPermission = (permission: PermissionType) =>
    !modelOptions?.permissions ||
    modelOptions?.permissions?.includes(permission);

  const modelOptions = options?.model?.[resource];
  const canCreate = hasPermission(Permission.CREATE);
  const canDelete = hasPermission(Permission.DELETE);

  const selectedRowsCount = Object.keys(selectedRows).length;

  const actions = useMemo(() => {
    const defaultActions: ModelAction[] = canDelete
      ? [
          {
            id: SPECIFIC_IDS_TO_RUN_ACTION.DELETE,
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

  const resourcePluralName = t(`model.${resource}.plural`, {}, title);

  return (
    <>
      <div className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default dark:border-b-dark-nextadmin-border-default border-b-nextadmin-border-default sticky top-14 z-20 flex h-auto w-full flex-row flex-wrap items-start justify-between gap-3 border-b px-4 py-4 shadow-sm sm:w-auto sm:items-center md:py-3 lg:top-0">
        <Breadcrumb
          breadcrumbItems={[
            {
              label: resourcePluralName,
              href: `${basePath}/${slugify(resource)}`,
              current: true,
              icon,
            },
          ]}
        />
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap md:gap-4">
          {(totalCount || 0 > 1 || (search && totalCount) || 0 > 1) && (
            <span className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default hidden min-w-fit text-sm sm:block">
              {search
                ? t("list.header.search.result_filtered", { count: totalCount })
                : t("list.header.search.result", {
                    count: totalCount,
                  })}
            </span>
          )}
          {onSearchChange && (
            <div className="bg-nextadmin-background-subtle dark:bg-dark-nextadmin-background-subtle ring-nextadmin-border-strong dark:ring-dark-nextadmin-border-strong flex min-w-0 items-center justify-end gap-2 rounded-md px-3 py-1 ring-1">
              <input
                id="search"
                name="search"
                onInput={onSearchChange}
                defaultValue={search}
                type="search"
                className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle rounded-md bg-[transparent] py-1.5 text-sm focus:outline-none focus:ring-0 focus:ring-offset-0 min-w-0 w-full"
                placeholder={`${t(
                  "list.header.search.placeholder"
                )} ${resourcePluralName.toLowerCase()}`}
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
          {modelOptions?.list?.exports &&
            (Array.isArray(modelOptions?.list?.exports) ? (
              <ExportDropdown exports={modelOptions?.list?.exports} />
            ) : (
              <Link
                prefetch={false}
                href={modelOptions?.list?.exports.url}
                target="_blank"
                className="text-nextadmin-content-inverted dark:text-dark-nextadmin-brand-inverted border-nextadmin-border-default dark:border-dark-nextadmin-border-default dark:bg-dark-nextadmin-background-subtle flex min-w-fit items-center gap-x-2 rounded-md border bg-transparent px-3 py-2 text-sm"
              >
                {t("list.row.actions.export", {
                  format: modelOptions?.list?.exports.format,
                })}
              </Link>
            ))}
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
