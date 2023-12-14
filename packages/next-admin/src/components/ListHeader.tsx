import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { RowSelectionState } from "@tanstack/react-table";
import Link from "next/link";
import { ChangeEvent, useMemo } from "react";
import Loader from "../assets/icons/Loader";
import { useConfig } from "../context/ConfigContext";
import { ModelAction, ModelName } from "../types";
import ActionsDropdown from "./ActionsDropdown";
import { buttonVariants } from "./radix/Button";
import Input, { inputVariants } from "./radix/Input";

type Props = {
  resource: ModelName;
  isPending: boolean;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
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

  const selectedRowsCount = Object.keys(selectedRows).length;

  const actions = useMemo<ModelAction[]>(() => {
    const defaultActions: ModelAction[] = [
      {
        title: "Delete",
        style: "destructive",
        action: async () => {
          await onDelete();
        },
      },
    ];

    return [...(actionsProp || []), ...defaultActions];
  }, [actionsProp, selectedRowsCount, onDelete]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4">
          {title}
        </h1>
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
            <span>Add</span>
            <PlusIcon className="h-5 w-5 ml-2" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="flex justify-end">
        <div>
          <div className="mt-4 flex justify-end items-center gap-2 relative">
            <div className="absolute top-1/2 translate-y-[-50%] left-2">
              {isPending ? (
                <Loader className="h-6 w-6 stroke-gray-400 animate-spin" />
              ) : (
                <MagnifyingGlassIcon
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
              )}
            </div>
            <Input
              name="search"
              onInput={onSearchChange}
              defaultValue={search}
              type="search"
              variant="default"
              placeholder={`Search`}
              withIcon
            />
          </div>
        </div>
      </div>
    </div>
  );
}
