import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowTopRightOnSquareIcon,
  Bars2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { ReactElement } from "react";

type Props = {
  label: string | ReactElement;
  deletable?: boolean;
  sortable?: boolean;
  onRemoveClick: () => void;
  href?: string;
  value: string;
};

const DndItem = ({
  label,
  deletable,
  sortable,
  onRemoveClick,
  href,
  value,
}: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: value });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className={clsx(
        "ring-nextadmin-border-default dark:ring-dark-nextadmin-border-strong bg-nextadmin-background-default dark:bg-dark-nextadmin-background-subtle relative flex w-full cursor-default justify-between gap-2 rounded-md px-3 py-2 text-sm placeholder-gray-500 shadow-sm ring-1",
        !deletable && "cursor-not-allowed opacity-50",
        "touch-none"
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
      aria-describedby="sortable-list"
    >
      <div className="flex flex-1 items-center gap-2">
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
      {(href || deletable) && (
        <div className="flex items-center space-x-3">
          {!!href && (
            <Link href={href} className="flex items-center">
              <ArrowTopRightOnSquareIcon className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-5 w-5 cursor-pointer" />
            </Link>
          )}
          {deletable && (
            <div onClick={() => onRemoveClick()}>
              <XMarkIcon className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-5 w-5 cursor-pointer" />
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default DndItem;
