import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/compat/router";
import { useTransition } from "react";

const SortButton = ({ field }: { field: string }) => {
  const router = useRouter();
  const searchParams = new URLSearchParams(router?.asPath);
  const sort =
    searchParams.get("sortColumn") === field
      ? searchParams.get("sortDirection")
      : null;
  const [_isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      Object.keys(router?.query as object).forEach((key) => {
        if (key.startsWith("sort")) {
          delete router?.query[key];
        }
      });
      router?.push({
        pathname: location.pathname,
        query: {
          ...router?.query,
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
        className="text-gray-400 hover:text-gray-500 inset-0 absolute w-full h-full"
      ></button>
      {sort === "asc" ? (
        <ArrowSmallUpIcon
          className="h-5 w-5 text-indigo-500"
          aria-hidden="true"
        />
      ) : sort === "desc" ? (
        <ArrowSmallDownIcon
          className="h-5 w-5 text-indigo-500"
          aria-hidden="true"
        />
      ) : null}
    </>
  );
};

export default SortButton;
