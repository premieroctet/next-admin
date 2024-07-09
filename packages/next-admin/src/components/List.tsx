"use client";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import debounce from "lodash/debounce";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { ITEMS_PER_PAGE } from "../config";
import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import { MessageProvider } from "../context/MessageContext";
import useDataColumns from "../hooks/useDataColumns";
import { useDeleteAction } from "../hooks/useDeleteAction";
import { useRouterInternal } from "../hooks/useRouterInternal";
import {
  AdminComponentProps,
  ListData,
  ListDataItem,
  ModelIcon,
  ModelName,
} from "../types";
import { DataTable } from "./DataTable";
import Filters from "./Filters";
import ListHeader from "./ListHeader";
import Message from "./Message";
import { Pagination } from "./Pagination";
import TableRowsIndicator from "./TableRowsIndicator";
import Button from "./radix/Button";
import Checkbox from "./radix/Checkbox";
import {
  Dropdown,
  DropdownBody,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "./radix/Dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./radix/Select";

export type ListProps = {
  resource: ModelName;
  data: ListData<ModelName>;
  total: number;
  resourcesIdProperty: Record<ModelName, string>;
  title: string;
  actions?: AdminComponentProps["actions"];
  icon?: ModelIcon;
};

function List({
  resource,
  data,
  total,
  actions,
  resourcesIdProperty,
  title,
  icon,
}: ListProps) {
  const { router, query } = useRouterInternal();
  const [isPending, startTransition] = useTransition();
  const { options } = useConfig();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const pageIndex = typeof query.page === "string" ? Number(query.page) - 1 : 0;
  const pageSize = Number(query.itemsPerPage) || (ITEMS_PER_PAGE as number);
  const sortColumn = query.sortColumn as string;
  const sortDirection = query.sortDirection as "asc" | "desc";
  const { deleteItems } = useDeleteAction(resource);
  const { t } = useI18n();
  const columns = useDataColumns({
    data,
    resource,
    sortable: true,
    resourcesIdProperty,
    sortColumn,
    sortDirection,
  });

  let onSearchChange;
  const modelOptions = options?.["model"]?.[resource];

  const hasDeletePermission =
    !modelOptions?.permissions || modelOptions?.permissions?.includes("delete");

  const filterOptions = modelOptions?.list?.filters;
  if (
    !(modelOptions?.list?.search && modelOptions?.list?.search?.length === 0)
  ) {
    onSearchChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        router?.push({
          pathname: location.pathname,
          query: { ...query, search: e.target.value },
        });
      });
    }, 300);
  }

  const checkboxColumn: ColumnDef<ListDataItem<ModelName>> = {
    id: "__nextadmin-select-row",
    header: ({ table }) => {
      if (table.getRowModel().rows.length === 0) {
        return null;
      }

      return (
        <div className="px-1">
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="px-1">
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
              disabled: !row.getCanSelect(),
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      );
    },
  };

  const actionsColumn: ColumnDef<ListDataItem<ModelName>> = {
    id: "__nextadmin-actions",
    header: () => {
      return null;
    },
    cell: ({ row }) => {
      const idProperty = resourcesIdProperty[resource];

      if (!hasDeletePermission) return;

      return (
        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant="ghost" size="sm" className="!px-2 py-2">
              <EllipsisVerticalIcon className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-6 w-6" />
            </Button>
          </DropdownTrigger>
          <DropdownBody>
            <DropdownContent
              side="left"
              sideOffset={5}
              className="z-50 px-1 py-2"
            >
              <DropdownItem asChild>
                <Button
                  variant="destructiveOutline"
                  className="h-6 px-1"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    deleteItems([row.original[idProperty].value as string]);
                  }}
                >
                  {t("list.row.actions.delete.label")}
                </Button>
              </DropdownItem>
            </DropdownContent>
          </DropdownBody>
        </Dropdown>
      );
    },
  };

  useEffect(() => {
    setRowSelection({});
  }, [data]);

  const getSelectedRowsIds = () => {
    const indices = Object.keys(rowSelection);

    const selectedRows = data.filter((_, index) => {
      return indices.includes(index.toString());
    });

    const idField = resourcesIdProperty[resource];

    return selectedRows.map((row) => row[idField].value as string | number) as
      | string[]
      | number[];
  };

  return (
    <>
      <div className="flow-root h-full">
        <ListHeader
          title={title}
          icon={icon}
          resource={resource}
          search={(query.search as string) || ""}
          onSearchChange={onSearchChange}
          isPending={isPending}
          selectedRows={rowSelection}
          actions={actions}
          getSelectedRowsIds={getSelectedRowsIds}
          onDelete={() => deleteItems(getSelectedRowsIds())}
          totalCount={total}
        />

        <div className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default max-w-full p-4 align-middle sm:p-8">
          <div className="-mt-2 mb-2 space-y-4 sm:-mt-4 sm:mb-4">
            <Message />
            <Filters filters={filterOptions!} />
          </div>
          <DataTable
            resource={resource}
            data={data}
            columns={[checkboxColumn, ...columns, actionsColumn]}
            resourcesIdProperty={resourcesIdProperty}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            icon={icon}
          />
          {data.length ? (
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2 py-4">
              <div>
                <TableRowsIndicator
                  pageIndex={pageIndex}
                  totalRows={total}
                  currentPageIndex={pageIndex}
                  pageSize={pageSize}
                />
              </div>
              <div className="flex flex-1 items-center justify-end gap-y-2 space-x-4">
                <Select
                  onValueChange={(value) => {
                    if (isNaN(Number(value))) return;
                    router?.push({
                      pathname: location.pathname,
                      query: {
                        ...query,
                        page: 1,
                        itemsPerPage: value,
                      },
                    });
                  }}
                >
                  <SelectTrigger className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-subtle max-h-[36px] max-w-[100px]">
                    <SelectValue asChild>
                      <span className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted pointer-events-none">
                        {pageSize}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"10"}>10</SelectItem>
                    <SelectItem value={"20"}>20</SelectItem>
                    <SelectItem value={"50"}>50</SelectItem>
                    <SelectItem value={"100"}>100</SelectItem>
                  </SelectContent>
                </Select>

                <Pagination
                  currentPageIndex={pageIndex}
                  totalPageCount={Math.ceil(total / pageSize)}
                  onPageChange={(pageIndex: number) => {
                    router?.push({
                      pathname: location.pathname,
                      query: {
                        ...query,
                        page: pageIndex + 1,
                      },
                    });
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

const ListWrapper = (props: ListProps) => {
  return (
    <MessageProvider>
      <List {...props} />
    </MessageProvider>
  );
};

export default ListWrapper;
