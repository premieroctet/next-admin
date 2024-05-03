import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useTransition } from "react";

interface Props {
  onClick: () => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  property: string;
  propertyName: string;
}
export default function TableHead({
  onClick,
  sortColumn,
  sortDirection,
  property,
  propertyName,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const isSorted = sortColumn === property;

  return (
    <button
      onClick={() => {
        startTransition(() => {
          onClick();
        });
      }}
      className="inline-flex items-center justify-center text-sm"
    >
      <span
        className={clsx(
          "text-nextadmin-content-inverted dark:text-dark-nextadmin-content-subtle whitespace-nowrap font-semibold capitalize"
        )}
      >
        {propertyName}
      </span>
      <span className="sr-only relative">
        , activate to sort column descending
      </span>
      {isSorted && sortDirection === "desc" && (
        <ArrowSmallDownIcon
          className="text-nextadmin-brand-subtle dark:text-dark-nextadmin-brand-subtle ml-2 h-5 w-5"
          aria-hidden="true"
        />
      )}
      {isSorted && sortDirection === "asc" && (
        <ArrowSmallUpIcon
          className="text-nextadmin-brand-subtle dark:text-dark-nextadmin-brand-subtle ml-2 h-5 w-5"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
