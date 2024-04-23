import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import debounce from "lodash/debounce";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import useSearchPaginatedResource from "../../../hooks/useSearchPaginatedResource";
import { DataEnumeration, Enumeration, ModelName } from "../../../types";
import { formatLabel } from "../../../utils/tools";
import Button from "../../radix/Button";
import { DialogClose, DialogTitle } from "../../radix/Dialog";
import MultiSelectListDialogDisplayAdminList from "./MultiSelectListDialogDisplayAdminList";
import MultiSelectListDialogDisplayList from "./MultiSelectListDialogDisplayList";

type Props = {
  name: string;
  initialOptions?: Enumeration[];
  values?: Enumeration[] | DataEnumeration[];
  onConfirm: (values: Enumeration[] | DataEnumeration[]) => void;
  display: "list" | "admin-list";
  resourceName: ModelName;
};

const MultiSelectListDialog = ({
  name,
  initialOptions,
  values,
  onConfirm,
  display,
  resourceName,
}: Props) => {
  const {
    runSearch,
    allOptions,
    setAllOptions,
    isPending,
    searchPage,
    hasNextPage,
  } = useSearchPaginatedResource({
    resourceName: name,
    initialOptions
  });
  const currentQuery = useRef("");
  const [selectedValues, setSelectedValues] = useState<
    DataEnumeration[] | Enumeration[]
  >(values ?? []);

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

  const onCheckValue = (value: Enumeration | DataEnumeration) => {
    setSelectedValues((old) => {
      const oldValueIdx = old.findIndex((val) => val.value === value.value);
      if (oldValueIdx > -1) {
        return old.filter((_, idx) => idx !== oldValueIdx) as
          | DataEnumeration[]
          | Enumeration[];
      }
      return [...old, value] as DataEnumeration[] | Enumeration[];
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
      {display === "list" && (
        <MultiSelectListDialogDisplayList
          options={orderedOptions as Enumeration[]}
          isPending={isPending}
          canShowMore={!!allOptions.length}
          onCheckValue={onCheckValue}
          onShowMore={() => {
            searchPage.current += 1;
            runSearch(currentQuery.current);
          }}
          selectedValues={selectedValues.map((val) => val.value)}
          hasNextPage={hasNextPage}
        />
      )}
      {display === "admin-list" && (
        <MultiSelectListDialogDisplayAdminList
          options={orderedOptions as DataEnumeration[]}
          isPending={isPending}
          canShowMore={!!allOptions.length}
          onCheckValue={onCheckValue}
          onShowMore={() => {
            searchPage.current += 1;
            runSearch(currentQuery.current);
          }}
          selectedValues={selectedValues.map((val) => val.value)}
          hasNextPage={hasNextPage}
          resource={resourceName}
        />
      )}
    </div>
  );
};

export default MultiSelectListDialog;
