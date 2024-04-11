"use client";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import debounce from "lodash/debounce";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { ITEMS_PER_PAGE } from "../config";
import { useConfig } from "../context/ConfigContext";
import { useDeleteAction } from "../hooks/useDeleteAction";
import { useRouterInternal } from "../hooks/useRouterInternal";
import {
  Field,
  ListData,
  ListDataFieldValue,
  ListDataItem,
  ListFieldsOptions,
  ModelAction,
  ModelIcon,
  ModelName,
  NextAdminOptions,
} from "../types";
import Cell from "./Cell";
import { DataTable } from "./DataTable";
import ListHeader from "./ListHeader";
import { Pagination } from "./Pagination";
import TableHead from "./TableHead";
import TableRowsIndicator from "./TableRowsIndicator";
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
  options?: Required<NextAdminOptions>["model"][ModelName];
  resourcesIdProperty: Record<ModelName, string>;
  title: string;
  actions?: ModelAction[];
  deleteAction?: ModelAction["action"];
  icon?: ModelIcon;
};

function List({
  resource,
  data,
  total,
  options,
  actions,
  resourcesIdProperty,
  title,
  deleteAction,
  icon,
}: ListProps) {
  const { router, query } = useRouterInternal();
  const [isPending, startTransition] = useTransition();
  const { isAppDir } = useConfig();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const pageIndex = typeof query.page === "string" ? Number(query.page) - 1 : 0;
  const pageSize = Number(query.itemsPerPage) || (ITEMS_PER_PAGE as number);
  const sortColumn = query.sortColumn as string;
  const sortDirection = query.sortDirection as "asc" | "desc";
  const { deleteItems } = useDeleteAction(resource, deleteAction);

  let onSearchChange;

  if (!(options?.list?.search && options?.list?.search?.length === 0)) {
    onSearchChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        router?.push({
          pathname: location.pathname,
          query: { ...query, search: e.target.value },
        });
      });
    }, 300);
  }

  const columns: ColumnDef<ListDataItem<ModelName>>[] =
    data && data?.length > 0
      ? (options?.list?.display || Object.keys(data[0])).map((property) => {
          const propertyAlias =
            options?.aliases?.[
              property as keyof ListFieldsOptions<typeof resource>
            ] || property;
          return {
            accessorKey: property,
            header: () => {
              return (
                <TableHead
                  sortDirection={sortDirection}
                  sortColumn={sortColumn}
                  property={property}
                  propertyName={propertyAlias}
                  key={property}
                  onClick={() => {
                    router?.push({
                      pathname: location.pathname,
                      query: {
                        ...query,
                        sortColumn: property,
                        sortDirection:
                          query.sortDirection === "asc" ? "desc" : "asc",
                      },
                    });
                  }}
                />
              );
            },
            cell: ({ row }) => {
              const modelData = row.original;
              const cellData = modelData[
                property as keyof ListFieldsOptions<ModelName>
              ] as unknown as ListDataFieldValue;

              const dataFormatter =
                options?.list?.fields?.[
                  property as keyof ListFieldsOptions<ModelName>
                ]?.formatter ||
                ((cell: any) => {
                  if (typeof cell === "object") {
                    return cell[resourcesIdProperty[property as ModelName]];
                  } else {
                    return cell;
                  }
                });

              return (
                <Cell
                  cell={cellData}
                  formatter={!isAppDir ? dataFormatter : undefined}
                  copyable={options?.list?.copy?.includes(
                    property as Field<ModelName>
                  )}
                />
              );
            },
          };
        })
      : [];

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
      <div className="flow-root">
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
        <div className="max-w-full p-4 align-middle sm:p-8">
          <DataTable
            resource={resource}
            data={data}
            columns={columns}
            resourcesIdProperty={resourcesIdProperty}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onDelete={async (id) => deleteItems([id] as string[] | number[])}
            icon={icon}
          />
          {data.length ? (
            <div className="flex flex-1 items-center space-x-2 py-4">
              <div>
                <TableRowsIndicator
                  pageIndex={pageIndex}
                  totalRows={total}
                  currentPageIndex={pageIndex}
                  pageSize={pageSize}
                />
              </div>
              <div className="flex flex-1 items-center justify-end space-x-4">
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
                  <SelectTrigger className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-subtle max-w-[100px]">
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

export default List;
