import { RJSFSchema } from "@rjsf/utils";
import { useConfig } from "../../../context/ConfigContext";
import { Enumeration } from "../../../types";
import { slugify } from "../../../utils/tools";
import DndItem from "../DndItem";

type Props = {
  item: Enumeration;
  deletable?: boolean;
  sortable?: boolean;
  onRemoveClick: (value: Enumeration["value"]) => void;
  schema: RJSFSchema;
};

const MultiSelectDisplayListItem = ({
  item,
  deletable,
  sortable,
  onRemoveClick,
  schema,
}: Props) => {
  const { basePath } = useConfig();
  const { value, label } = item;

  // @ts-expect-error
  const relationModel = item?.data?.modelName ?? schema.items?.relation;

  return (
    <DndItem
      sortable={sortable}
      deletable={deletable}
      value={item.value}
      label={label}
      onRemoveClick={() => onRemoveClick(value)}
      href={
        relationModel
          ? `${basePath}/${slugify(relationModel)}/${value}`
          : undefined
      }
    />
  );
};

export default MultiSelectDisplayListItem;
