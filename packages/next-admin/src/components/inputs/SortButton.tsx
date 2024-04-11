import React, { useTransition } from "react";
import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
} from "@heroicons/react/24/outline";
import { useRouterInternal } from "../../hooks/useRouterInternal";

const SortButton = ({ field }: { field: string }) => {
  const { router, query } = useRouterInternal();
  const searchParams = query;
  const sort =
    searchParams.sortColumn === field ? searchParams.sortDirection : null;
  const [_isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      Object.keys(query as object).forEach((key) => {
        if (key.startsWith("sort")) {
          delete query[key];
        }
      });
      router?.push({
        pathname: location.pathname,
        query: {
          ...query,
          sortColumn: field,
          sortDirection: sort === "asc" ? "desc" : "asc",
        },
      });
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="absolute inset-0 h-full w-full text-gray-400 hover:text-gray-500"
      ></button>
      {sort === "asc" ? (
        <ArrowSmallUpIcon
          className="text-nextadmin-primary-500 h-5 w-5"
          aria-hidden="true"
        />
      ) : sort === "desc" ? (
        <ArrowSmallDownIcon
          className="text-nextadmin-primary-500 h-5 w-5"
          aria-hidden="true"
        />
      ) : null}
    </>
  );
};

export default SortButton;
