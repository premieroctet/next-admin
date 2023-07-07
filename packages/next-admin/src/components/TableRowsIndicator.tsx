import React from "react";

interface Props {
  currentPageIndex: number;
  pageIndex: number;
  pageSize: number;
  totalRows: number;
}
export default function TableRowsIndicator({
  currentPageIndex,
  pageIndex,
  pageSize,
  totalRows,
}: Props) {
  const start = currentPageIndex * pageSize + 1;
  const end = Math.min(pageSize * (pageIndex + 1), totalRows);
  return (
    <div>
      <p className="text-sm text-neutral-500">
        Showing from <span className="font-medium">{start}</span> to{" "}
        <span className="font-medium">{end}</span> on{" "}
        <span className="font-medium">{totalRows}</span>
      </p>
    </div>
  );
}
