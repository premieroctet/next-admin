import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./radix/Table";
import { ListData, ListDataItem, ModelName, Field } from "../types";
import { useConfig } from "../context/ConfigContext";
import { useRouterInternal } from "../hooks/useRouterInternal";

interface DataTableProps {
  columns: ColumnDef<ListDataItem<ModelName>>[];
  data: ListData<ModelName>;
  resource: ModelName;
}

export function DataTable({ columns, data, resource }: DataTableProps) {
  const { router } = useRouterInternal();
  const { basePath } = useConfig();
  const columnsVisibility = columns.reduce(
    (acc, column) => {
      // @ts-expect-error
      const key = column.accessorKey as Field<typeof resource>;
      acc[key] = Object.keys(data[0]).includes(key);
      return acc;
    },
    {} as Record<Field<typeof resource>, boolean>
  );

  const table = useReactTable({
    data,
    manualSorting: true,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: columnsVisibility,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-indigo-100">
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
                className="cursor-pointer hover:bg-indigo-50"
                onClick={() => {
                  router.push({
                    // @ts-expect-error
                    pathname: `${basePath}/${resource}/${row.original.id.value}`,
                  });
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="text-center text-gray-500">{`No ${resource} found`}</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
