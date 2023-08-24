import Link from "next/link";
import { ADMIN_BASE_PATH } from "../config";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChangeEvent } from "react";
import Loader from "../assets/icons/Loader";
import { ModelName } from "../types";
import { PlusIcon } from "@heroicons/react/24/solid";
import { buttonVariants } from "./radix/Button";

type Props = {
  resource: ModelName;
  isPending: boolean;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  search: string;
};

export default function ListHeader({
  resource,
  isPending,
  onSearchChange,
  search,
}: Props) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <div className="mt-4 flex justify-end items-center gap-2">
          {isPending ? (
            <Loader className="h-6 w-6 stroke-gray-400 animate-spin" />
          ) : (
            <MagnifyingGlassIcon
              className="h-6 w-6 text-gray-400"
              aria-hidden="true"
            />
          )}
          <input
            name="search"
            onInput={onSearchChange}
            defaultValue={search}
            type="search"
            className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus-visible:outline focus-visible:outline-indigo-500 focus-visible:ring focus-visible:ring-indigo-500"
            placeholder={`Search`}
          />
        </div>
      </div>
      <Link
        href={`${ADMIN_BASE_PATH}/${resource}/new`}
        role="button"
        className={buttonVariants({
          variant: "default",
          size: "sm",
        })}
      >
        <span>Add</span>
        <PlusIcon className="h-5 w-5 ml-2" aria-hidden="true" />
      </Link>
    </div>
  );
}
