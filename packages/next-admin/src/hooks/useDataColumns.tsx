import React, { useMemo } from "react";
import {
  Field,
  ListDataFieldValue,
  ListDataItem,
  ListFieldsOptions,
  ModelName,
  NextAdminOptions,
} from "../types";
import TableHead from "../components/TableHead";
import { useRouterInternal } from "./useRouterInternal";
import { ColumnDef } from "@tanstack/react-table";
import Cell from "../components/Cell";
import { useConfig } from "../context/ConfigContext";

type UseDataColumnsParams = {
  sortable?: boolean;
  data: any[];
  resource: ModelName;
  sortDirection?: "asc" | "desc";
  sortColumn?: string;
  resourcesIdProperty: Record<ModelName, string>;
};

const useDataColumns = ({
  sortable,
  data,
  resource,
  sortDirection,
  sortColumn,
  resourcesIdProperty,
}: UseDataColumnsParams) => {
  const { router, query } = useRouterInternal();
  const { isAppDir, options: configOptions } = useConfig();

  const options = configOptions!.model![resource];

  return useMemo<ColumnDef<ListDataItem<ModelName>>[]>(() => {
    return data && data?.length > 0
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
                    if (sortable) {
                      router?.push({
                        pathname: location.pathname,
                        query: {
                          ...query,
                          sortColumn: property,
                          sortDirection:
                            query.sortDirection === "asc" ? "desc" : "asc",
                        },
                      });
                    }
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
  }, [
    data,
    options?.list?.display,
    options?.list?.fields,
    options?.list?.copy,
    options?.aliases,
    sortDirection,
    sortColumn,
    sortable,
    router,
    query,
    isAppDir,
    resourcesIdProperty,
  ]);
};

export default useDataColumns;
