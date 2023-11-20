"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useRouter } from "next/compat/router";
import { useConfig } from "../context/ConfigContext";
import {
  Field,
  ListData,
  ListDataItem,
  ModelName,
  NextAdminOptions,
} from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./radix/Table";

interface DataTableProps<M extends ModelName> {
  columns: ColumnDef<ListDataItem<M>>[];
  data: ListData<M>;
  resource: M;
  options: Required<NextAdminOptions>["model"][M];
}

export function DataTable<M extends ModelName>({
  columns,
  data,
  resource,
  options,
}: DataTableProps<M>) {
  const router = useRouter();
  const { basePath } = useConfig();
  const hasDisplayField = options?.list?.display?.length ? true : false;
  const columnsVisibility = columns.reduce(
    (acc, column) => {
      // @ts-expect-error
      const key = column.accessorKey as Field<typeof resource>;
      acc[key] = options?.list?.display?.includes(key) ? true : false;
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
      columnVisibility: !hasDisplayField ? {} : columnsVisibility,
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
                  router?.push({
                    pathname: `${basePath}/${resource}/${row.original.id}`,
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
