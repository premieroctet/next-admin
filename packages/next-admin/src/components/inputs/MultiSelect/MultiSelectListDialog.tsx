import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import debounce from "lodash/debounce";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import useSearchPaginatedResource from "../../../hooks/useSearchPaginatedResource";
import { Enumeration } from "../../../types";
import { formatLabel } from "../../../utils/tools";
import Spinner from "../../common/Spinner";
import Button from "../../radix/Button";
import Checkbox from "../../radix/Checkbox";
import { DialogClose, DialogTitle } from "../../radix/Dialog";

type Props = {
  name: string;
  initialOptions?: Enumeration[];
  values?: Enumeration[];
  onConfirm: (values: Enumeration[]) => void;
};

const MultiSelectListDialog = ({
  name,
  initialOptions,
  values,
  onConfirm,
}: Props) => {
  const {
    runSearch,
    allOptions,
    setAllOptions,
    isPending,
    searchPage,
    hasNextPage,
  } = useSearchPaginatedResource({
    modelName: name,
    initialOptions: initialOptions ?? values,
  });
  const currentQuery = useRef("");
  const [selectedValues, setSelectedValues] = useState(values ?? []);

  const onSearchChange = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
    if (initialOptions) {
      const query = e.target.value.toLowerCase();
      const filteredOptions = initialOptions.filter((option) =>
        option.label.toLowerCase().includes(query)
      );
      setAllOptions(filteredOptions);
      return;
    }
    setAllOptions([]);
    searchPage.current = 1;
    currentQuery.current = e.target.value;
    runSearch(currentQuery.current, true);
  }, 300);

  const onCheckValue = (value: Enumeration) => {
    setSelectedValues((old) => {
      const oldValueIdx = old.findIndex((val) => val.value === value.value);
      if (oldValueIdx > -1) {
        return old.filter((_, idx) => idx !== oldValueIdx);
      }
      return [...old, value];
    });
  };

  useEffect(() => {
    runSearch(currentQuery.current);
  }, []);

  const orderedOptions = useMemo(() => {
    return [
      ...(values ?? []),
      ...allOptions.filter((option) => {
        return !values?.some((val) => val.value === option.value);
      }),
    ];
  }, [allOptions, values]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <DialogTitle>{formatLabel(name)}</DialogTitle>
        <div className="flex gap-2">
          {!!selectedValues && !!allOptions.length && (
            <Button size="sm" icon onClick={() => onConfirm(selectedValues)}>
              <CheckIcon className="h-4 w-4" />
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="ghost" size="sm" icon>
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
      </div>
      <input
        defaultValue={currentQuery.current}
        type="text"
        className="dark:bg-dark-nextadmin-background-subtle text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted ring-nextadmin-border-default focus:ring-nextadmin-brand-default dark:focus:ring-dark-nextadmin-brand-default dark:ring-dark-nextadmin-border-strong block w-full rounded-md border-0 px-2 py-1.5 text-sm shadow-sm ring-1 ring-inset transition-all duration-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6 md:w-1/2"
        placeholder="Search..."
        onChange={onSearchChange}
      />
      <div className="space-y-2">
        {!!orderedOptions.length && (
          <ul className="max-h-[32rem] overflow-y-scroll">
            {orderedOptions.map((option, index) => {
              const checked = selectedValues.some(
                (value) => value.value === option.value
              );

              return (
                <li
                  key={option.value}
                  className="border-b-nextadmin-border-strong dark:border-b-dark-nextadmin-border-strong text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted flex items-center gap-3 border-b-2 px-1 py-2 last:border-b-0"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => {
                      onCheckValue(option);
                    }}
                    id={`${name}-option-${option.value}`}
                  />
                  <label htmlFor={`${name}-option-${option.value}`}>
                    {option.label}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
        {isPending && (
          <div className="flex h-10 w-full items-center justify-center">
            <Spinner />
          </div>
        )}
        {!!allOptions.length && (
          <div className="flex w-full justify-center">
            <Button
              disabled={isPending || !hasNextPage}
              onClick={() => {
                searchPage.current += 1;
                runSearch(currentQuery.current);
              }}
            >
              Show more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectListDialog;
