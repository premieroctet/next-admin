import clsx from "clsx";
import debounce from "lodash/debounce";
import { ChangeEvent, useTransition } from "react";
import Loader from "../../assets/icons/Loader";
import { useRouterInternal } from "../../hooks/useRouterInternal";
import { Enumeration } from "../../types";
import { Transition } from "@headlessui/react";

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
    <Transition.Root show={open} as="div">
      <Transition.Child
        as="div"
        className="absolute z-10 w-full overflow-auto bg-white rounded-md shadow-2xl max-h-60 ring-1 ring-black ring-opacity-5 mt-2"
        enter="transition-all ease-linear"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all ease-linear"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <div className="flex flex-col relative">
          <div className="block sticky top-0 items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
            <div className="relative flex items-center">
              <input
                id={`${name}-search`}
                type="text"
                className="transition-all block w-full px-3 py-2 text-base placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none sm:text-sm"
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
      </Transition.Child>
    </Transition.Root>
  );
};
