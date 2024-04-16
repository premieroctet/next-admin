import { Transition } from "@headlessui/react";
import debounce from "lodash/debounce";
import { ChangeEvent, createRef, useEffect, useRef, useState } from "react";
import { useConfig } from "../../context/ConfigContext";
import { useForm } from "../../context/FormContext";
import { Enumeration } from "../../types";
import LoaderRow from "../LoaderRow";

export type SelectorProps = {
  open: boolean;
  name: string;
  onChange: (otpion: Enumeration) => void;
  options?: Enumeration[];
};

export const Selector = ({ open, name, onChange, options }: SelectorProps) => {
  const { basePath, isAppDir } = useConfig();
  const { searchPaginatedResourceAction, dmmfSchema, resource } = useForm();
  const [isPending, setIsPending] = useState(false);
  const [allOptions, setAllOptions] = useState<Enumeration[]>(options ?? []);
  const totalSearchedItems = useRef(0);
  const searchPage = useRef(1);
  const currentQuery = useRef("");
  const searchInput = createRef<HTMLInputElement>();
  const [isLastRowReached, setIsLastRowReached] = useState(false);

  useEffect(() => {
    if (open && searchInput.current) {
      searchInput.current.focus();
    }
  }, [open, searchInput]);

  useEffect(() => {
    if (open && !options) {
      runSearch(true);
    }

    return () => {
      searchPage.current = 1;
    };
  }, [open]);

  const runSearch = async (resetOptions = true) => {
    const perPage = 25;
    const query = currentQuery.current;

    const fieldFromDmmf = dmmfSchema?.find((model) => model.name === name);

    if (!fieldFromDmmf) {
      return;
    }

    const model = fieldFromDmmf.type;

    try {
      setIsPending(true);
      if (isAppDir) {
        const response = await searchPaginatedResourceAction?.({
          originModel: resource!,
          property: name,
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
        const response = await fetch(`${basePath}/api/options`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            originModel: resource!,
            property: name,
            model,
            query,
            page: searchPage.current,
            perPage,
          }),
        });

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

    setAllOptions([]);
    searchPage.current = 1;
    currentQuery.current = e.target.value;
    setIsLastRowReached(false);
    runSearch(true);
  }, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      allOptions?.length > 0 &&
      allOptions.length >= totalSearchedItems.current
    ) {
      setIsLastRowReached(true);
    }
  }, [allOptions, totalSearchedItems]);

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
        className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-emphasis ring-nextadmin-border-strong dark:ring-dark-nextadmin-border-strong absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md shadow-2xl ring-1"
        enter="transition-all ease-linear"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all ease-linear"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
        ref={containerRef}
        onScroll={onScroll}
      >
        <div className="relative flex flex-col">
          <div className="dark:bg-dark-nextadmin-background-subtle dark:border-dark-nextadmin-border-strong sticky top-0 block items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2">
            <div className="relative flex items-center">
              <input
                id={`${name}-search`}
                ref={searchInput}
                defaultValue={currentQuery.current}
                type="text"
                className="dark:bg-dark-nextadmin-background-subtle text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted ring-nextadmin-border-default focus:ring-nextadmin-brand-default dark:focus:ring-dark-nextadmin-brand-default dark:ring-dark-nextadmin-border-strong block w-full rounded-md border-0 px-2 py-1.5 text-sm shadow-sm ring-1 ring-inset transition-all duration-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6"
                placeholder="Search..."
                onChange={onSearchChange}
              />
            </div>
          </div>
          {allOptions &&
            allOptions.length > 0 &&
            allOptions?.map((option, index: number) => (
              <div
                key={index}
                className="dark:bg-dark-nextadmin-background-subtle dark:text-dark-nextadmin-content-inverted dark:hover:bg-dark-nextadmin-brand-default cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onMouseDown={() => {
                  onChange(option);
                }}
              >
                {option.label}
              </div>
            ))}

          {allOptions && allOptions.length === 0 && !isPending ? (
            <div className="dark:bg-dark-nextadmin-background-subtle dark:text-dark-nextadmin-content-inverted px-3 py-2 text-sm text-gray-700">
              No results found
            </div>
          ) : (
            !isLastRowReached && <LoaderRow />
          )}
        </div>
      </Transition.Child>
    </Transition.Root>
  );
};
