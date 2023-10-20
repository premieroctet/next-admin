import { ColumnDef } from "@tanstack/react-table";
import debounce from "lodash/debounce";
import { useRouter } from "next/compat/router";
import { ChangeEvent, useTransition } from "react";
import { ITEMS_PER_PAGE } from "../config";
import { ListData, ListDataItem, ListFieldsOptions, Model, ModelName, NextAdminOptions } from "../types";
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
  options?: (Required<NextAdminOptions>)['model'][ModelName]
};

function List({ resource, data, total, options }: ListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pageIndex =
    typeof router?.query.page === "string" ? Number(router.query.page) - 1 : 0;
  const pageSize =
    Number(router?.query.itemsPerPage) || (ITEMS_PER_PAGE as number);
  const sortColumn = router?.query.sortColumn as string;
  const sortDirection = router?.query.sortDirection as "asc" | "desc";

  const onSearchChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      router?.push({
        pathname: location.pathname,
        query: { ...router?.query, search: e.target.value },
      });
    });
  }, 300);

  const columns: ColumnDef<ListDataItem<ModelName>>[] =
    data && data?.length > 0
      ? Object.keys(data[0]).map((property) => {
        return {
          accessorKey: property,
          header: () => {
            return (
              <TableHead
                sortDirection={sortDirection}
                sortColumn={sortColumn}
                property={property}
                onClick={() => {
                  router?.push({
                    pathname: location.pathname,
                    query: {
                      ...router?.query,
                      sortColumn: property,
                      sortDirection:
                        router?.query.sortDirection === "asc"
                          ? "desc"
                          : "asc",
                    },
                  });
                }}
              />
            );
          },
          cell: ({ row }) => {
            const modelData = row.original;
            const cellData = modelData[property as keyof ListFieldsOptions<ModelName>];
            const dataFormatter = options?.list?.fields?.[property as keyof ListFieldsOptions<ModelName>]?.formatter || ((cell: any) => {
              if (typeof cell === "object") {
                return cell.id
              } else {
                return cell
              }
            })

            return (
              <Cell cell={cellData} formatter={dataFormatter} />
            );
          },
        };
      })
      : [];

  return (
    <>
      <div className="mt-4">
        <h1 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4">
          {resource}
        </h1>
      </div>
      <div className="mt-4 flow-root">
        <ListHeader
          resource={resource}
          search={(router?.query.search as string) || ""}
          onSearchChange={onSearchChange}
          isPending={isPending}
        />
        <div className="max-w-full mt-2 py-2 align-middle">
          <DataTable
            resource={resource}
            data={data}
            columns={columns}
            options={options}
          />
          {data.length ? (
            <div className="flex-1 flex items-center space-x-2 py-4">
              <div >
                <TableRowsIndicator
                  pageIndex={pageIndex}
                  totalRows={total}
                  currentPageIndex={pageIndex}
                  pageSize={pageSize}
                />
              </div>
              <div className="flex-1 flex items-center justify-end space-x-4">
                <Select
                  onValueChange={(value) => {
                    if (isNaN(Number(value))) return;
                    router?.push({
                      pathname: location.pathname,
                      query: {
                        ...router?.query,
                        page: 1,
                        itemsPerPage: value,
                      },
                    });
                  }}
                >
                  <SelectTrigger className="max-w-[100px]">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem className="cursor-pointer" value={"10"}>
                      10
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value={"20"}>
                      20
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value={"50"}>
                      50
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value={"100"}>
                      100
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Pagination
                  currentPageIndex={pageIndex}
                  totalPageCount={Math.ceil(total / pageSize)}
                  onPageChange={(pageIndex: number) => {
                    router?.push({
                      pathname: location.pathname,
                      query: {
                        ...router?.query,
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
