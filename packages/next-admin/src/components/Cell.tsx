import React, { ReactNode } from "react";

import { ListDataFieldValue, ListDataItem, ModelName } from "../types";
import Link from "next/link";
import clsx from "clsx";
import { useConfig } from "../context/ConfigContext";

type Props = {
  cell: ListDataFieldValue | ReactNode
  formatter: (cell: any) => ReactNode
};

export default function Cell({ cell, formatter }: Props) {
  const { basePath } = useConfig()

  const isReactNode = (cell: ListDataFieldValue | ReactNode): cell is ReactNode => {
    return React.isValidElement(cell)
  }
  if (cell && cell !== null) {
    if (React.isValidElement(cell)) {
      return cell;
    } else if (typeof cell === "object" && !isReactNode(cell)) {
      if (cell.type === "link") {
        return (
          <Link
            onClick={(e) => e.stopPropagation()}
            href={`${basePath}/${cell.value.url}`}
            className="hover:underline cursor-pointer text-indigo-700 hover:text-indigo-900 font-semibold"
          >
            {formatter(cell.value.label)}
          </Link>
        );
      } else if (cell.type === "count") {
        return (
          <div className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            <p>{formatter(cell.value)}</p>
          </div>
        );
      } else if (cell.type === "date") {
        return (
          <div className="whitespace-nowrap max-w-[20ch] overflow-hidden text-ellipsis text-neutral-600">
            <p>{formatter(cell.value.toString())}</p>
          </div>
        );
      }
    } else if (typeof cell === "string") {
      return (
        <div className="whitespace-nowrap overflow-hidden text-ellipsis text-neutral-600">
          <p>{formatter(cell.toString())}</p>
        </div>
      );
    } else if (typeof cell === "number") {
      return (
        <div className="whitespace-nowrap max-w-[20ch] overflow-hidden text-ellipsis text-neutral-600">
          <p>{formatter(cell.toString())}</p>
        </div>
      );
    } else if (typeof cell === "boolean") {
      return (
        <div
          className={clsx(
            "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
            cell ? "bg-indigo-50 text-indigo-500" :
              "bg-neutral-50 text-neutral-600"
          )}
        >
          <p>{formatter(cell.toString())}</p>
        </div>
      );
    }

    return <div>{JSON.stringify(cell)}</div>;
  }
  return null;
}
