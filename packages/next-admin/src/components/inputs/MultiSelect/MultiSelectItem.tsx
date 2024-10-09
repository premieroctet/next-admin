import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useConfig } from "../../../context/ConfigContext";
import { Enumeration, Field, ModelName, SchemaProperty } from "../../../types";
import { slugify } from "../../../utils/tools";

type Props = {
  onRemoveClick: (value: any) => void;
  deletable?: boolean;
  item: Enumeration;
  propertySchema: SchemaProperty<ModelName>[Field<ModelName>];
};

const MultiSelectItem = ({
  item,
  onRemoveClick,
  propertySchema,
  deletable = true,
}: Props) => {
  const { basePath } = useConfig();

  const relationModel =
    item?.data?.modelName ?? propertySchema?.items?.relation;

  return (
    <div className="py border-nextadmin-border-default dark:border-dark-nextadmin-border-strong text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted dark:hover:bg-dark-nextadmin-background-muted/50 hover:bg-nextadmin-background-muted relative z-10 flex cursor-default items-center justify-center rounded-md border px-2 text-sm">
      {relationModel ? (
        <Link href={`${basePath}/${slugify(relationModel)}/${item.value}`}>
          {item.label}
        </Link>
      ) : (
        item.label
      )}
      {deletable && (
        <button
          type="button"
          className="ml-1 flex-shrink-0 cursor-pointer text-gray-400 hover:text-gray-500"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemoveClick(item.value);
          }}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default MultiSelectItem;
