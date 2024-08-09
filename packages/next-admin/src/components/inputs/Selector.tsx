import { Transition } from "@headlessui/react";
import debounce from "lodash/debounce";
import {
  ChangeEvent,
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useI18n } from "../../context/I18nContext";
import useSearchPaginatedResource from "../../hooks/useSearchPaginatedResource";
import { Enumeration } from "../../types";
import LoaderRow from "../LoaderRow";

export type SelectorProps = {
  open: boolean;
  name: string;
  onChange: (option: Enumeration) => void;
  options?: Enumeration[];
  selectedOptions?: string[];
};

export const Selector = forwardRef<HTMLDivElement, SelectorProps>(
  ({ open, name, onChange, options, selectedOptions }, ref) => {
    const currentQuery = useRef("");
    const searchInput = createRef<HTMLInputElement>();
    const { t } = useI18n();
    const {
      allOptions,
      isPending,
      runSearch,
      searchPage,
      setAllOptions,
      totalSearchedItems,
    } = useSearchPaginatedResource({
      fieldName: name,
      initialOptions: options,
    });
    const [optionsLeft, setOptionsLeft] = useState<Enumeration[]>(() => {
      return allOptions.filter(
        (item) => !selectedOptions?.includes(item.value)
      );
    });

    const containerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => containerRef.current!);

    useEffect(() => {
      if (open && searchInput.current) {
        searchInput.current.focus();
      }
    }, [open, searchInput]);

    useEffect(() => {
      if (open && !options) {
        runSearch(currentQuery.current, true);
      }

      return () => {
        searchPage.current = 1;
      };
    }, [open]);

    useEffect(() => {
      setOptionsLeft(
        allOptions.filter((item) => !selectedOptions?.includes(item.value))
      );
    }, [selectedOptions, allOptions]);

    const onSearchChange = debounce(
      async (e: ChangeEvent<HTMLInputElement>) => {
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
        runSearch(currentQuery.current, true);
      },
      300
    );

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
        offset >= -100 &&
        offset <= 0 &&
        !isPending &&
        optionsLeft.length < totalSearchedItems.current
      ) {
        searchPage.current += 1;
        runSearch(currentQuery.current, false);
      }
    };

    return (
      <Transition.Root show={open} as="div">
        <Transition.Child
          as="div"
          className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-emphasis ring-nextadmin-border-default dark:ring-dark-nextadmin-border-strong absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-md shadow-2xl ring-1"
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
                  placeholder={`${t("list.header.search.placeholder")}...`}
                  onChange={onSearchChange}
                />
              </div>
            </div>
            {optionsLeft &&
              optionsLeft.length > 0 &&
              optionsLeft?.map((option, index: number) => (
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
            {isPending && <LoaderRow />}
            {optionsLeft && optionsLeft.length === 0 && !isPending && (
              <div className="dark:bg-dark-nextadmin-background-subtle dark:text-dark-nextadmin-content-inverted px-3 py-2 text-sm text-gray-700">
                No results found
              </div>
            )}
          </div>
        </Transition.Child>
      </Transition.Root>
    );
  }
);
