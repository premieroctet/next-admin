import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Cell from "../components/Cell";
import TableHead from "../components/TableHead";
import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import {
  Field,
  ListDataFieldValue,
  ListDataItem,
  ListFieldsOptions,
  ModelName,
  NextAdminContext,
  VirtualField,
} from "../types";
import { useRouterInternal } from "./useRouterInternal";

type UseDataColumnsParams = {
  sortable?: boolean;
  data: any[];
  resource: ModelName;
  sortDirection?: "asc" | "desc";
  sortColumn?: string;
  resourcesIdProperty: Record<ModelName, string>;
  rawData?: any[];
};

const useDataColumns = ({
  sortable,
  data,
  resource,
  sortDirection,
  sortColumn,
  resourcesIdProperty,
  rawData,
}: UseDataColumnsParams) => {
  const { router, query } = useRouterInternal();
  const { isAppDir, options: configOptions } = useConfig();
  const { t } = useI18n();

  const options = configOptions?.model?.[resource];

  const allDisplayedFields = useMemo(() => {
    if (options?.list?.display) {
      return options.list.display.map((disp) => {
        if (typeof disp === "string") {
          return {
            name: disp,
            virtual: false,
            label: undefined,
          };
        }
        return {
          name: disp.key,
          virtual: true,
          label: t(disp.label),
        };
      });
    }

    if (data?.[0]) {
      return Object.keys(data[0]).map((key) => ({
        name: key,
        virtual: false,
        label: undefined,
      }));
    }

    return [];
  }, []);

  return useMemo<ColumnDef<ListDataItem<ModelName>>[]>(() => {
    return data && data?.length > 0
      ? allDisplayedFields.map((property) => {
          const propertyName = property.name;
          const isVirtualField = property.virtual;

          const propertyAlias = t(
            `model.${resource}.fields.${propertyName}`,
            {},
            options?.aliases?.[
              propertyName as keyof ListFieldsOptions<typeof resource>
            ] ||
              property.label ||
              propertyName
          );

          const isColumnSortable = sortable && !isVirtualField;

          return {
            accessorKey: propertyName,
            header: () => {
              return (
                <TableHead
                  className={
                    isColumnSortable ? "cursor-pointer" : "cursor-default"
                  }
                  sortDirection={sortDirection}
                  sortColumn={sortColumn}
                  property={propertyName}
                  propertyName={propertyAlias}
                  key={propertyName}
                  onClick={() => {
                    if (isColumnSortable) {
                      router?.push({
                        pathname: location.pathname,
                        query: {
                          ...query,
                          sortColumn: propertyName,
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
                propertyName as keyof ListFieldsOptions<ModelName>
              ] as unknown as ListDataFieldValue;
              const dataFormatter = isVirtualField
                ? (
                    options?.list?.display?.find(
                      (disp) =>
                        typeof disp === "object" && disp.key === propertyName
                    ) as VirtualField<ModelName>
                  )?.formatter
                : options?.list?.fields?.[
                    propertyName as keyof ListFieldsOptions<ModelName>
                  ]?.formatter;

              return (
                <Cell
                  cell={cellData}
                  formatter={
                    !isAppDir
                      ? dataFormatter
                        ? (row: any, ctx?: NextAdminContext) => {
                            if (isVirtualField) {
                              // @ts-expect-error
                              return dataFormatter?.({
                                row,
                                locale: ctx?.locale,
                              });
                            } else {
                              return dataFormatter?.(row[propertyName], ctx);
                            }
                          }
                        : undefined
                      : undefined
                  }
                  copyable={options?.list?.copy?.includes(
                    propertyName as Field<ModelName>
                  )}
                  getRawData={() => {
                    return rawData?.[row.index];
                  }}
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
    rawData,
  ]);
};

export default useDataColumns;
