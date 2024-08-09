import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowTopRightOnSquareIcon,
  Bars2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { RJSFSchema } from "@rjsf/utils";
import clsx from "clsx";
import Link from "next/link";
import { useConfig } from "../../../context/ConfigContext";
import { Enumeration } from "../../../types";
import { slugify } from "../../../utils/tools";

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: item.value });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className={clsx(
        "ring-nextadmin-border-default dark:ring-dark-nextadmin-border-strong bg-nextadmin-background-default dark:bg-dark-nextadmin-background-subtle relative flex w-full cursor-default justify-between rounded-md px-3 py-2 text-sm placeholder-gray-500 shadow-sm ring-1",
        !deletable && "cursor-not-allowed opacity-50"
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
      aria-describedby="sortable-list"
    >
      <div className="flex items-center gap-2">
        {sortable && (
          <div
            ref={setActivatorNodeRef}
            className={clsx({
              "cursor-grab active:cursor-grabbing": sortable,
            })}
            {...listeners}
          >
            <Bars2Icon className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-4 w-4" />
          </div>
        )}
        {label}
      </div>
      <div className="flex items-center space-x-3">
        <Link
          href={`${basePath}/${slugify(
            item?.data?.modelName ??
              // @ts-expect-error
              schema.items?.relation
          )}/${value}`}
          className="flex items-center"
        >
          <ArrowTopRightOnSquareIcon className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-5 w-5 cursor-pointer" />
        </Link>
        {deletable && (
          <div onClick={() => onRemoveClick(value)}>
            <XMarkIcon className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-5 w-5 cursor-pointer" />
          </div>
        )}
      </div>
    </li>
  );
};

export default MultiSelectDisplayListItem;
