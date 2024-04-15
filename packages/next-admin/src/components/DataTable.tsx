import {
  ColumnDef,
  OnChangeFn,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import { Field, ListData, ListDataItem, ModelIcon, ModelName } from "../types";
import { slugify } from "../utils/tools";
import EmptyState from "./EmptyState";
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
  icon?: ModelIcon;
}

export function DataTable({
  columns,
  data,
  resource,
  resourcesIdProperty,
  rowSelection,
  setRowSelection,
  onDelete,
  icon,
}: DataTableProps) {
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
                    onDelete?.(
                      row.original[idProperty].value as string | number
                    );
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
    <div className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-emphasis border-nextadmin-border-default dark:border-dark-nextadmin-border-default overflow-hidden rounded-lg border">
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
                className={`hover:bg-nextadmin-background-muted text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted dark:hover:bg-dark-nextadmin-background-muted/75 border-b-nextadmin-border-strong dark:border-b-dark-nextadmin-border-default cursor-pointer border-b ${
                  row.getIsSelected()
                    ? "bg-nextadmin-background-emphasis/40 dark:bg-dark-nextadmin-background-subtle"
                    : "even:bg-nextadmin-background-subtle dark:even:bg-dark-nextadmin-background-subtle/60"
                }`}
                onClick={() => {
                  window.location.href = `${basePath}/${slugify(resource)}/${
                    row.original[modelIdProperty].value
                  }`;
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className={`group py-3 ${
                      cell.column.id === "__nextadmin-actions" && "text-right"
                    }`}
                    key={cell.id}
                  >
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
                <EmptyState resource={resource} icon={icon} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
