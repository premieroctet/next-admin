import { useConfig } from "../../../context/ConfigContext";
import { Enumeration, Field, ModelName, SchemaProperty } from "../../../types";
import { slugify } from "../../../utils/tools";
import DndItem from "../DndItem";

type Props = {
  item: Enumeration;
  deletable?: boolean;
  sortable?: boolean;
  onRemoveClick: (value: Enumeration["value"]) => void;
  propertySchema: SchemaProperty<ModelName>[Field<ModelName>];
};

const MultiSelectDisplayListItem = ({
  item,
  deletable,
  sortable,
  onRemoveClick,
  propertySchema,
}: Props) => {
  const { basePath } = useConfig();
  const { value, label } = item;

  const relationModel =
    item?.data?.modelName ?? propertySchema?.items?.relation;

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
