import {
  DndContext,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext
} from '@dnd-kit/sortable';
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ColumnDef,
  OnChangeFn,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect } from "react";
import { useConfig } from "../context/ConfigContext";
import { useRouterInternal } from "../hooks/useRouterInternal";
import { Field, ListData, ListDataItem, ModelIcon, ModelName } from "../types";
import { slugify } from "../utils/tools";
import EmptyState from "./EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./radix/Table";
import SortableTableRow from './SortableTableRow';

interface DataTableDefaultProps {
  columns: ColumnDef<ListDataItem<ModelName>>[];
  data: ListData<ModelName>;
  resource: ModelName;
  resourcesIdProperty: Record<ModelName, string>;
  rowSelection: RowSelectionState;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  icon?: ModelIcon;
  editing?: boolean;
  onRemoveClick?: (value: any) => void;
  deletable?: boolean;
  onOrderChange?: undefined;
  orderField?: undefined;
}

type OrderableDataTableProps = Omit<DataTableDefaultProps, "onOrderChange" | "orderField"> & {
  onOrderChange: (value: { currentId: string | number, moveOverId: string | number }) => void;
  orderField: string;
}

export function DataTable({
  columns,
  data,
  resource,
  resourcesIdProperty,
  rowSelection,
  setRowSelection,
  icon,
  onRemoveClick,
  deletable = false,
  onOrderChange,
  orderField,
}: OrderableDataTableProps | DataTableDefaultProps) {
  const { basePath } = useConfig();
  const { router } = useRouterInternal();
  const columnsVisibility = columns.reduce(
    (acc, column) => {
      // @ts-expect-error
      const key = column.accessorKey as Field<typeof resource>;
      if (data[0]) {
        acc[key] = Object.keys(data[0]).includes(key);
      }
      return acc;
    },
    {} as Record<Field<typeof resource>, boolean>
  );

  const modelIdProperty = resourcesIdProperty[resource];

  const handleColumnOrderChange = onOrderChange ? (value: any) => {
    onOrderChange(value);
  } : undefined;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onOrderChange?.({
        currentId: active.id,
        moveOverId: over.id
      });
    }
  };

  const table = useReactTable({
    data,
    manualSorting: true,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: columnsVisibility,
    },
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onColumnOrderChange: handleColumnOrderChange,
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const pageNumber = Number(searchParams.get("page"));
    if (!table.getRowModel().rows?.length && pageNumber && pageNumber > 1) {
      const searchParamsObject = Object.fromEntries(searchParams.entries());
      router.replace({
        pathname: location.pathname,
        query: {
          ...searchParamsObject,
          page: 1,
        },
      });
    }
  }, [router, table]);

  return (
    <div className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-emphasis border-nextadmin-border-default dark:border-dark-nextadmin-border-default overflow-hidden rounded-lg border">
      {orderField ? (
        <DndContext onDragEnd={handleDragEnd}>
          <Table>
            {table.getRowModel().rows?.length > 0 && (
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b-nextadmin-border-strong dark:border-b-dark-nextadmin-border-default"
                  >
                    <TableHead className='w-10' />
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            )}
            <TableBody>
              {table.getRowModel().rows?.length ? (
                <SortableContext items={data.map(row => row[modelIdProperty].value as string)}>
                  {table.getRowModel().rows.map((row) => (
                    <SortableTableRow
                      key={row.id}
                      id={row.original[modelIdProperty].value as string}
                      data-state={row.getIsSelected() && "selected"}
                      className={`hover:bg-nextadmin-background-muted text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted dark:hover:bg-dark-nextadmin-background-muted/75 border-b-nextadmin-border-strong dark:border-b-dark-nextadmin-border-default cursor-pointer border-b ${row.getIsSelected()
                        ? "bg-nextadmin-background-emphasis/40 dark:bg-dark-nextadmin-background-subtle"
                        : "even:bg-nextadmin-background-subtle dark:even:bg-dark-nextadmin-background-subtle/60"
                        }`}
                      onClick={() => {
                        window.location.href = `${basePath}/${slugify(resource)}/${row.original[modelIdProperty].value
                          }`;
                      }}
                      grabElement={<TableCell className='pr-0'>
                        <Bars2Icon className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-5 w-5 cursor-grab active:cursor-grabbing" />
                      </TableCell>}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          className={`group py-3 ${cell.column.id === "__nextadmin-actions" && "text-right"
                            }`}
                          key={cell.id}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                      {deletable && onRemoveClick && (
                        <TableCell className="flex justify-end">
                          <XMarkIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              return onRemoveClick(row.original[modelIdProperty].value);
                            }}
                            className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-5 w-5 cursor-pointer"
                          />
                        </TableCell>
                      )}
                    </SortableTableRow>
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    <EmptyState resource={resource} icon={icon} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      ) : (
        <Table>
          {table.getRowModel().rows?.length > 0 && (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b-nextadmin-border-strong dark:border-b-dark-nextadmin-border-default"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`hover:bg-nextadmin-background-muted text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted dark:hover:bg-dark-nextadmin-background-muted/75 border-b-nextadmin-border-strong dark:border-b-dark-nextadmin-border-default cursor-pointer border-b ${row.getIsSelected()
                    ? "bg-nextadmin-background-emphasis/40 dark:bg-dark-nextadmin-background-subtle"
                    : "even:bg-nextadmin-background-subtle dark:even:bg-dark-nextadmin-background-subtle/60"
                    }`}
                  onClick={() => {
                    window.location.href = `${basePath}/${slugify(resource)}/${row.original[modelIdProperty].value
                      }`;
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={`group py-3 ${cell.column.id === "__nextadmin-actions" && "text-right"
                        }`}
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  {deletable && onRemoveClick && (
                    <TableCell className="flex justify-end">
                      <XMarkIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          return onRemoveClick(
                            row.original[modelIdProperty].value
                          );
                        }}
                        className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-5 w-5 cursor-pointer"
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  <EmptyState resource={resource} icon={icon} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
