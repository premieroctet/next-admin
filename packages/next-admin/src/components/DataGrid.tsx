import { RowSelectionState } from "@tanstack/react-table";
import { AdminComponentProps, GridData, ModelName } from "../types";
import DataGridItem from "./DataGridItem";
import { Dispatch, SetStateAction } from "react";

type Props = {
  data: GridData[];
  resource: ModelName;
  actions: AdminComponentProps["actions"];
  onDelete: (id: string) => void;
  canDelete: boolean;
  selectedItems: RowSelectionState;
  setSelectedItems: Dispatch<SetStateAction<RowSelectionState>>;
};

const DataGrid = ({
  data,
  resource,
  actions,
  onDelete,
  canDelete,
  selectedItems,
  setSelectedItems,
}: Props) => {
  const hasSelection = Object.keys(selectedItems).length > 0;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4 sm:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
      {data.map((item) => {
        return (
          <DataGridItem
            key={item.id}
            item={item}
            resource={resource}
            actions={actions}
            onDelete={onDelete}
            canDelete={canDelete}
            selectionVisible={hasSelection}
            selected={selectedItems[item.id]}
            onSelect={() =>
              setSelectedItems((old) => {
                const newSelected = { ...old };
                if (newSelected[item.id]) {
                  delete newSelected[item.id];
                } else {
                  newSelected[item.id] = true;
                }
                return newSelected;
              })
            }
          />
        );
      })}
    </div>
  );
};

export default DataGrid;
