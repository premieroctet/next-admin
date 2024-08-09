import React, { ReactNode } from "react";

import clsx from "clsx";
import Link from "next/link";
import { useConfig } from "../context/ConfigContext";
import { ListDataFieldValue } from "../types";
import { getDisplayedValue } from "../utils/tools";
import Clipboard from "./common/Clipboard";

type Props = {
  cell: ListDataFieldValue;
  formatter?: (cell: any) => ReactNode;
  copyable?: boolean;
};

export default function Cell({ cell, formatter, copyable }: Props) {
  const { basePath } = useConfig();

  let cellValue = cell?.__nextadmin_formatted;

  const isReactNode = (
    cell: ListDataFieldValue["__nextadmin_formatted"]
  ): cell is ReactNode => {
    return React.isValidElement(cell);
  };

  if (cell && cell !== null) {
    if (React.isValidElement(cellValue)) {
      return (
        <div className="flex gap-1">
          {cellValue}
          {copyable && <Clipboard value={getDisplayedValue(cellValue)} />}
        </div>
      );
    } else if (typeof cell === "object" && !isReactNode(cellValue)) {
      if (formatter) {
        cellValue = formatter(cell?.value);
      }

      if (cell.type === "link") {
        return (
          <Link
            onClick={(e) => e.stopPropagation()}
            href={`${basePath}/${cell.value.url}`}
            className="text-nextadmin-brand-emphasis dark:text-dark-nextadmin-brand-subtle hover:text-nextadmin-brand-emphasis dark:hover:text-dark-nextadmin-brand-emphasis flex cursor-pointer items-center gap-1 font-semibold hover:underline"
          >
            {cellValue}
            {copyable && <Clipboard value={cell.value.url} />}
          </Link>
        );
      } else if (cell.type === "count") {
        return (
          <div className="bg-nextadmin-background-subtle dark:bg-dark-nextadmin-background-subtle text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle ring-nextadmin-border-default dark:ring-dark-nextadmin-border-strong inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset">
            <p>{cellValue}</p>
          </div>
        );
      } else if (cell.type === "date") {
        return (
          <div className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle flex max-w-[20ch] items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
            <p>{cellValue}</p>
            {copyable && <Clipboard value={cellValue?.toString() ?? ""} />}
          </div>
        );
      } else if (cell.type === "scalar" && typeof cell.value === "string") {
        return (
          <div className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
            <p>{cellValue}</p>
            {copyable && <Clipboard value={cellValue?.toString() ?? ""} />}
          </div>
        );
      } else if (cell.type === "scalar" && typeof cell.value === "number") {
        return (
          <div className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle flex max-w-[20ch] items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
            <p>{cellValue}</p>
            {copyable && <Clipboard value={cellValue?.toString() ?? ""} />}
          </div>
        );
      } else if (cell.type === "scalar" && typeof cell.value === "boolean") {
        return (
          <div
            className={clsx(
              "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
              "bg-nextadmin-background-subtle dark:bg-dark-nextadmin-background-subtle text-nextadmin-brand-subtle dark:text-dark-nextadmin-content-subtle"
            )}
          >
            <p>{cellValue}</p>
          </div>
        );
      }
    }

    return (
      <div className="text-nextadmin-brand-subtle dark:text-dark-nextadmin-content-subtle flex items-center gap-1">
        {JSON.stringify(cellValue)}
        {copyable && <Clipboard value={JSON.stringify(cellValue)} />}
      </div>
    );
  }
  return null;
}
