import React, { ReactNode } from "react";

import Clipboard from "./common/Clipboard";
import { ListDataFieldValue } from "../types";
import Link from "next/link";
import clsx from "clsx";
import { useConfig } from "../context/ConfigContext";

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
      return cellValue;
    } else if (typeof cell === "object" && !isReactNode(cellValue)) {
      if (formatter) {
        cellValue = formatter(cellValue);
      }

      if (cell.type === "link") {
        return (
          <Link
            onClick={(e) => e.stopPropagation()}
            href={`${basePath}/${cell.value.url}`}
            className="hover:underline cursor-pointer text-nextadmin-brand-emphasis dark:text-dark-nextadmin-brand-subtle hover:text-nextadmin-brand-emphasis dark:hover:text-dark-nextadmin-brand-emphasis font-semibold flex items-center gap-1"
          >
            {cellValue}
            {copyable && <Clipboard value={cell.value.url} />}
          </Link>
        );
      } else if (cell.type === "count") {
        return (
          <div className="inline-flex items-center rounded-md bg-nextadmin-background-subtle dark:bg-dark-nextadmin-background-subtle px-2 py-1 text-xs font-medium text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle ring-1 ring-inset ring-nextadmin-border-default dark:ring-dark-nextadmin-border-strong">
            <p>{cellValue}</p>
          </div>
        );
      } else if (cell.type === "date") {
        return (
          <div className="whitespace-nowrap max-w-[20ch] overflow-hidden text-ellipsis text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle flex items-center gap-1">
            <p>{cellValue}</p>
            {copyable && <Clipboard value={cellValue?.toString() ?? ""} />}
          </div>
        );
      } else if (cell.type === "scalar" && typeof cell.value === "string") {
        return (
          <div className="whitespace-nowrap overflow-hidden text-ellipsis text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle flex items-center gap-1">
            <p>{cellValue}</p>
            {copyable && <Clipboard value={cellValue?.toString() ?? ""} />}
          </div>
        );
      } else if (cell.type === "scalar" && typeof cell.value === "number") {
        return (
          <div className="whitespace-nowrap max-w-[20ch] overflow-hidden text-ellipsis text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle flex items-center gap-1">
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
      <div className="flex items-center gap-1 text-nextadmin-brand-subtle dark:text-dark-nextadmin-content-subtle">
        {JSON.stringify(cellValue)}
        {copyable && <Clipboard value={JSON.stringify(cellValue)} />}
      </div>
    );
  }
  return null;
}
