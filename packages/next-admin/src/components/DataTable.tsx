import {
  ColumnDef,
  OnChangeFn,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import { useRouterInternal } from "../hooks/useRouterInternal";
import { Field, ListData, ListDataItem, ModelName } from "../types";
import { Checkbox } from "./common/Checkbox";
import Button from "./radix/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./radix/Table";

interface DataTableProps {
  columns: ColumnDef<ListDataItem<ModelName>>[];
  data: ListData<ModelName>;
  resource: ModelName;
  resourcesIdProperty: Record<ModelName, string>;
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
  onDelete?: (id: string | number) => void;
}

export function DataTable({
  columns,
  data,
  resource,
  resourcesIdProperty,
  rowSelection,
  setRowSelection,
  onDelete,
}: DataTableProps) {
  const { router } = useRouterInternal();
  const { basePath } = useConfig();
  const { t } = useI18n();

  const columnsVisibility = columns.reduce(
    (acc, column) => {
      // @ts-expect-error
      const key = column.accessorKey as Field<typeof resource>;
      acc[key] = Object.keys(data[0]).includes(key);
      return acc;
    },
    {} as Record<Field<typeof resource>, boolean>
  );

  const modelIdProperty = resourcesIdProperty[resource];
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
        <Button
          size="sm"
          variant="destructiveOutline"
          onClick={(evt) => {
            evt.stopPropagation();
            onDelete?.(row.original[idProperty].value as string | number);
          }}
        >
          {t("list.row.actions.delete.label")}
        </Button>
      );
    },
  };

  const table = useReactTable({
    data,
    manualSorting: true,
    columns: [checkboxColumn, ...columns, actionsColumn],
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: columnsVisibility,
    },
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="overflow-hidden shadow-md ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer even:bg-gray-50"
                onClick={() => {
                  window.location.href = `${basePath}/${resource.toLowerCase()}/${
                    row.original[modelIdProperty].value
                  }`;
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="group" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                <div className="text-center text-gray-500">
                  {t("list.empty.label", { resource })}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
