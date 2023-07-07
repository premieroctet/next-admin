"use client";
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
import { useRouter } from "next/compat/router";
import { ADMIN_BASE_PATH } from "../config";
import { ressourceToUrl } from "../utils/tools";
import { ListData, ListDataItem, ModelName } from "../types";

interface DataTableProps {
  columns: ColumnDef<ListDataItem<ModelName>, { id: string }>[];
  data: ListData<ModelName>;
  ressource: ModelName;
}

export function DataTable({
  columns,
  data,
  ressource,
}: DataTableProps) {
  const router = useRouter();
  const table = useReactTable({
    data,
    manualSorting: true,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                    pathname: `${ADMIN_BASE_PATH}/${ressourceToUrl(
                      ressource
                    )}/${row.original.id}`,
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
                <div className="text-center text-gray-500">{`No ${ressource} found`}</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
  );
}
