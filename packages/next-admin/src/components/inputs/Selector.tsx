import clsx from "clsx";
import debounce from "lodash/debounce";
import { ChangeEvent, useTransition } from "react";
import Loader from "../../assets/icons/Loader";
import { useRouterInternal } from "../../hooks/useRouterInternal";
import { Enumeration } from "../../types";

export type SelectorProps = {
  open: boolean;
  options?: Enumeration[];
  name: string;
  onChange: (otpion: Enumeration) => void;
};

export const Selector = ({ open, options, name, onChange }: SelectorProps) => {
  const { router, query } = useRouterInternal();
  const [isPending, startTransition] = useTransition();
  const onSearchChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      router.push({
        pathname: location.pathname,
        query: { ...query, [`${name}search`]: e.target.value },
      });
    });
  }, 300);

  return (
    <div
      className={clsx(
        "absolute z-10 w-full overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 mt-2",
        {
          hidden: !open,
        }
      )}
    >
      <div className="flex flex-col relative">
        <div className="block sticky top-0 items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
          <div className="relative flex items-center">
            <input
              id={`${name}-search`}
              type="text"
              className="block w-full px-3 py-2 text-base placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search..."
              onChange={onSearchChange}
              defaultValue={query[`${name}search`]}
            />
            {isPending && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Loader className="w-5 h-5 stroke-gray-400 animate-spin" />
              </div>
            )}
          </div>
        </div>
        {options && options.length > 0 ? (
          options?.map((option: any, index: number) => (
            <div
              key={index}
              className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900"
              onMouseDown={() => {
                onChange(option);
              }}
            >
              {option.label}
            </div>
          ))
        ) : (
          <div className="px-3 py-2 text-sm text-gray-700">
            No results found
          </div>
        )}
      </div>
    </div>
  );
};
