import { Transition } from "@headlessui/react";
import debounce from "lodash/debounce";
import { ChangeEvent, useRef, useState } from "react";
import Loader from "../../assets/icons/Loader";
import { useConfig } from "../../context/ConfigContext";
import { useForm } from "../../context/FormContext";
import { Enumeration } from "../../types";

export type SelectorProps = {
  open: boolean;
  name: string;
  onChange: (otpion: Enumeration) => void;
  options?: Enumeration[];
};

export const Selector = ({ open, name, onChange, options }: SelectorProps) => {
  const { basePath, isAppDir } = useConfig();
  const { searchPaginatedResourceAction, dmmfSchema } = useForm();
  const [isPending, setIsPending] = useState(false);
  const [allOptions, setAllOptions] = useState<Enumeration[]>(options ?? []);
  const totalSearchedItems = useRef(0);
  const searchPage = useRef(1);
  const currentQuery = useRef("");

  const runSearch = async (resetOptions = true) => {
    const perPage = 25;
    const query = currentQuery.current;

    if (!query) {
      setAllOptions([]);
      return;
    }

    const fieldFromDmmf = dmmfSchema?.find((model) => model.name === name);

    if (!fieldFromDmmf) {
      return;
    }

    const model = fieldFromDmmf.type;

    try {
      setIsPending(true);
      if (isAppDir) {
        const response = await searchPaginatedResourceAction?.({
          model,
          query,
          page: searchPage.current,
          perPage,
        });

        if (response && !response.error) {
          setAllOptions((old) => {
            if (resetOptions) {
              return response.data;
            }

            return [...old, ...response.data];
          });
          totalSearchedItems.current = response.total;
        }
      } else {
        const response = await fetch(
          `${basePath}/${model}?search=${query}&itemsPerPage=${perPage}&json=true&page=${searchPage.current}`
        );

        if (response.ok) {
          const responseJson = await response.json();

          if (!responseJson.error) {
            setAllOptions((old) => {
              if (resetOptions) {
                return responseJson.data;
              }

              return [...old, ...responseJson.data];
            });
            totalSearchedItems.current = responseJson.total;
          }
        }
      }
    } finally {
      setIsPending(false);
    }
  };

  const onSearchChange = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
    // Options are pre-filled for enum, so we do a local search
    if (options) {
      const query = e.target.value.toLowerCase();
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(query)
      );
      setAllOptions(filteredOptions);
      return;
    }

    searchPage.current = 1;
    currentQuery.current = e.target.value;
    runSearch(true);
  }, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    // No need to do an infinite scroll for enums
    if (!containerRef.current || options) {
      return;
    }
    const scrollY =
      containerRef.current.scrollHeight - containerRef.current.scrollTop;
    const height = containerRef.current.offsetHeight;

    const offset = height - scrollY;

    if (
      offset === 0 &&
      !isPending &&
      allOptions.length < totalSearchedItems.current
    ) {
      searchPage.current += 1;
      runSearch(false);
    }
  };

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
        ref={containerRef}
        onScroll={onScroll}
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
              />
              {isPending && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Loader className="w-5 h-5 stroke-gray-400 animate-spin" />
                </div>
              )}
            </div>
          </div>
          {allOptions && allOptions.length > 0 ? (
            allOptions?.map((option, index: number) => (
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
