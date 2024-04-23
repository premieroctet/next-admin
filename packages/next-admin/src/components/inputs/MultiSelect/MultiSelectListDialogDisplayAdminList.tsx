import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "../../../context/FormContext";
import useDataColumns from "../../../hooks/useDataColumns";
import {
  DataEnumeration,
  Enumeration,
  ListDataItem,
  ModelName,
} from "../../../types";
import Spinner from "../../common/Spinner";
import Button from "../../radix/Button";
import Checkbox from "../../radix/Checkbox";
import { DataTable } from "../../DataTable";

type Props = {
  options: DataEnumeration[];
  selectedValues: string[];
  onCheckValue: (option: DataEnumeration) => void;
  isPending: boolean;
  canShowMore?: boolean;
  onShowMore: () => void;
  hasNextPage: boolean;
  resource: ModelName;
};

const MultiSelectListDialogDisplayList = ({
  options,
  selectedValues,
  onCheckValue,
  isPending,
  canShowMore,
  hasNextPage,
  onShowMore,
  resource,
}: Props) => {
  const { resourcesIdProperty } = useForm();
  const columns = useDataColumns({
    sortable: false,
    data: options.map((option) => option.data),
    resource,
    resourcesIdProperty: resourcesIdProperty!,
  });

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

  return (
    <div className="space-y-2">
      {!!options.length && (
        <DataTable
          columns={[checkboxColumn, ...columns]}
          data={options.map((option) => option.data)}
          resource={resource}
          resourcesIdProperty={resourcesIdProperty!}
          rowSelection={{}}
        />
      )}
      {isPending && (
        <div className="flex h-10 w-full items-center justify-center">
          <Spinner />
        </div>
      )}
      {canShowMore && (
        <div className="flex w-full justify-center">
          <Button disabled={isPending || !hasNextPage} onClick={onShowMore}>
            Show more
          </Button>
        </div>
      )}
    </div>
  );
};

export default MultiSelectListDialogDisplayList;
