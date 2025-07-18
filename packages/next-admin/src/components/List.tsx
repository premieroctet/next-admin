"use client";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import clsx from "clsx";
import debounce from "lodash.debounce";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { twMerge } from "tailwind-merge";
import { ITEMS_PER_PAGE } from "../config";
import ClientActionDialogProvider from "../context/ClientActionDialogContext";
import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import useDataColumns from "../hooks/useDataColumns";
import { useDeleteAction } from "../hooks/useDeleteAction";
import { useRouterInternal } from "../hooks/useRouterInternal";
import {
  AdminComponentProps,
  FilterWrapper,
  GridData,
  LayoutType,
  ListData,
  ListDataItem,
  ModelIcon,
  ModelName,
  Schema,
} from "../types";
import { reorderData, slugify } from "../utils/tools";
import ActionDropdownItem from "./ActionDropdownItem";
import { DataTable } from "./DataTable";
import Filters from "./Filters";
import ListHeader from "./ListHeader";
import { Message } from "./Message";
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
} from "./radix/Select";
import DataGrid from "./DataGrid";
import LayoutSwitch from "./LayoutSwitch";
import ListActionsDropdown from "./ListActionsDropdown";

export type ListProps = {
  resource: ModelName;
  data: ListData<ModelName> | GridData[];
  total: number;
  resourcesIdProperty: Record<ModelName, string>;
  title: string;
  actions?: AdminComponentProps["actions"];
  icon?: ModelIcon;
  schema: Schema;
  clientActionsComponents?: AdminComponentProps["dialogComponents"];
  rawData: any[];
  listFilterOptions?: Array<FilterWrapper<ModelName>>;
  layout: LayoutType;
};

const itemsPerPageSizes = [10, 25, 50, 100];

function List({
  resource,
  data,
  total,
  actions,
  resourcesIdProperty,
  title,
  icon,
  schema,
  clientActionsComponents,
  rawData,
  listFilterOptions,
  layout,
}: ListProps) {
  const { router, query } = useRouterInternal();
  const [isPending, startTransition] = useTransition();
  const [_orderPending, startOrderTransition] = useTransition();
  const { options, apiBasePath } = useConfig();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const pageIndex = typeof query.page === "string" ? Number(query.page) - 1 : 0;
  const modelDefaultListSize =
    options?.model?.[resource]?.list?.defaultListSize;
  const pageSize =
    Number(query.itemsPerPage) || modelDefaultListSize || ITEMS_PER_PAGE;
  const modelOptions = options?.["model"]?.[resource];
  const sortColumn = !modelOptions?.list?.orderField
    ? (query.sortColumn as string)
    : undefined;
  const sortDirection = !modelOptions?.list?.orderField
    ? (query.sortDirection as "asc" | "desc")
    : undefined;
  const { deleteItems } = useDeleteAction(resource);
  const { t } = useI18n();
  const columns = useDataColumns({
    data,
    resource,
    sortable: modelOptions?.list?.orderField ? false : true,
    resourcesIdProperty,
    sortColumn,
    sortDirection,
    rawData,
  });
  const supportsGridLayout = modelOptions?.list?.layout?.grid;

  const allListSizes = useMemo(() => {
    if (modelDefaultListSize) {
      return [...itemsPerPageSizes, modelDefaultListSize].sort((a, b) => a - b);
    }

    return itemsPerPageSizes;
  }, [modelDefaultListSize]);

  let onSearchChange;

  const [optimisticData, optimisticOrderData] = useOptimistic(
    data,
    (prevData, newData: ListData<ModelName>) => {
      if (!modelOptions?.list?.orderField) return prevData;
      return newData;
    }
  );

  const hasDeletePermission =
    !modelOptions?.permissions || modelOptions?.permissions?.includes("delete");
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

      return (
        <ListActionsDropdown
          actions={actions}
          onDelete={() =>
            deleteItems([row.original[idProperty].value as string])
          }
          resource={resource}
          canDelete={hasDeletePermission}
          id={row.original[idProperty].value as string}
        />
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

    return selectedRows.map((row) =>
      layout === "grid"
        ? row.id
        : ((row as ListData<ModelName>[number])[idField].value as
            | string
            | number)
    ) as string[] | number[];
  };

  const handleOrderChange = modelOptions?.list?.orderField
    ? (value: { currentId: string | number; moveOverId: string | number }) => {
        startOrderTransition(async () => {
          const idField = resourcesIdProperty[resource];
          const newData = reorderData(
            optimisticData as ListData<ModelName>,
            value.currentId,
            value.moveOverId,
            modelOptions?.list?.orderField!,
            idField
          );
          optimisticOrderData(newData);

          await fetch(`${apiBasePath}/${slugify(resource)}/order`, {
            method: "POST",
            body: JSON.stringify(optimisticData),
          });
          router.refresh();
        });
      }
    : undefined;

  return (
    <ClientActionDialogProvider componentsMap={clientActionsComponents}>
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
          schema={schema}
        />

        <div className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default max-w-full p-4 align-middle sm:p-8">
          <div className="-mt-2 mb-2 space-y-4 sm:-mt-4 sm:mb-4">
            <Message />
            <div className="flex flex-row items-center justify-between gap-4">
              <Filters filters={listFilterOptions!} />
              {supportsGridLayout && <LayoutSwitch selectedLayout={layout} />}
            </div>
          </div>
          {layout === "table" && (
            <DataTable
              resource={resource}
              data={optimisticData as ListData<ModelName>}
              columns={[checkboxColumn, ...columns, actionsColumn]}
              resourcesIdProperty={resourcesIdProperty}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              icon={icon}
              onOrderChange={handleOrderChange!}
              orderField={modelOptions?.list?.orderField!}
            />
          )}
          {layout === "grid" && (
            <DataGrid
              data={data as GridData[]}
              resource={resource}
              actions={actions}
              canDelete={hasDeletePermission}
              onDelete={(id) => deleteItems([id])}
              selectedItems={rowSelection}
              setSelectedItems={setRowSelection}
            />
          )}
          {optimisticData.length ? (
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
                    <span className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted pointer-events-none">
                      {pageSize}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {allListSizes.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
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
    </ClientActionDialogProvider>
  );
}

export default List;
