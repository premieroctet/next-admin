import { XMarkIcon } from "@heroicons/react/24/outline";
import { RJSFSchema } from "@rjsf/utils";
import Link from "next/link";
import { useConfig } from "../../../context/ConfigContext";
import { Enumeration } from "../../../types";
import { slugify } from "../../../utils/tools";

type Props = {
  onRemoveClick: (value: any) => void;
  deletable?: boolean;
  item: Enumeration;
  schema: RJSFSchema;
};

const MultiSelectItem = ({
  item,
  onRemoveClick,
  schema,
  deletable = true,
}: Props) => {
  const { basePath } = useConfig();

  return (
    <div className="py border-nextadmin-border-default dark:border-dark-nextadmin-border-strong text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted dark:hover:bg-dark-nextadmin-background-muted/50 hover:bg-nextadmin-background-muted relative z-10 flex cursor-default items-center justify-center rounded-md border px-2 text-sm">
      <Link
        href={`${basePath}/${slugify(
          item?.data?.modelName ??
            // @ts-expect-error
            schema.items?.relation
        )}/${item.value}`}
      >
        {item.label}
      </Link>
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
