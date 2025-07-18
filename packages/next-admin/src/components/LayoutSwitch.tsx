import { Squares2X2Icon, TableCellsIcon } from "@heroicons/react/24/outline";
import { useRouterInternal } from "../hooks/useRouterInternal";
import { LayoutType } from "../types";
import { ToggleGroupItem, ToggleGroupRoot } from "./radix/ToggleGroup";

type Props = {
  selectedLayout: LayoutType;
};

const LayoutSwitch = ({ selectedLayout }: Props) => {
  const { router } = useRouterInternal();

  return (
    <div>
      <ToggleGroupRoot
        type="single"
        value={selectedLayout}
        onValueChange={(val) => {
          if (!val) {
            return;
          }
          router.setQuery(
            {
              layout: val,
            },
            true
          );
        }}
      >
        <ToggleGroupItem value="table">
          <TableCellsIcon className="size-6" />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid">
          <Squares2X2Icon className="size-6" />
        </ToggleGroupItem>
      </ToggleGroupRoot>
    </div>
  );
};

export default LayoutSwitch;
