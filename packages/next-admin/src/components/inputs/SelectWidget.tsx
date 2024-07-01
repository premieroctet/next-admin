import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { WidgetProps } from "@rjsf/utils";
import clsx from "clsx";
import Link from "next/link";
import { useMemo, useRef } from "react";
import DoubleArrow from "../../assets/icons/DoubleArrow";
import { useConfig } from "../../context/ConfigContext";
import { useForm } from "../../context/FormContext";
import useCloseOnOutsideClick from "../../hooks/useCloseOnOutsideClick";
import { Enumeration } from "../../types";
import { slugify } from "../../utils/tools";
import { Selector } from "./Selector";

const SelectWidget = ({
  options,
  onChange,
  value,
  disabled,
  required,
  ...props
}: WidgetProps) => {
  const formContext = useForm();
  const name = props.name;
  options as { enumOptions: Enumeration[] };
  const enumOptions = options.enumOptions?.map(
    (option: any) => option.value as Enumeration
  );
  const containerRef = useRef<HTMLDivElement>(null);
  useCloseOnOutsideClick(containerRef, () => formContext.setOpen(false, name));

  const { basePath } = useConfig();

  const handleChange = (option: Enumeration) => {
    onChange(option);
    formContext.setOpen(false, name);
  };

  const hasValue = useMemo(() => {
    return Object.keys(value || {}).length > 0;
  }, [value]);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={clsx(
          "ring-nextadmin-border-default dark:ring-dark-nextadmin-border-strong dark:bg-dark-nextadmin-background-subtle flex w-full cursor-default justify-between rounded-md px-3 py-2 text-sm placeholder-gray-500 shadow-sm ring-1",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <select
          name={name}
          className={clsx(
            "absolute inset-0 h-full w-full opacity-0",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
          disabled={disabled}
          required={required && !hasValue}
          onMouseDown={(e) => {
            e.preventDefault();
            if (!disabled) {
              formContext.toggleOpen(name);
            }
          }}
        >
          <option value={value?.value} />
        </select>
        <span
          id={name}
          className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted h-full w-full flex-1 appearance-none bg-transparent focus:outline-none"
        >
          {value?.label || props.placeholder}
        </span>
        <div className="relative z-10 flex cursor-pointer space-x-3">
          {hasValue && props.schema.relation && (
            <Link
              href={`${basePath}/${slugify(
                props.schema.relation
              )}/${value?.value}`}
              className="flex items-center"
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5 cursor-pointer text-gray-400" />
            </Link>
          )}
          {hasValue && !disabled && (
            <button
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                onChange({});
              }}
            >
              <XMarkIcon className="h-5 w-5 cursor-pointer text-gray-400" />
            </button>
          )}
          {!disabled && (
            <div className="flex items-center">
              <DoubleArrow />
            </div>
          )}
        </div>
      </div>
      <Selector
        open={!!formContext.relationState?.[name]?.open!}
        options={enumOptions?.length ? enumOptions : undefined}
        name={props.name}
        onChange={handleChange}
        selectedOptions={hasValue ? [value?.value] : []}
      />
    </div>
  );
};

export default SelectWidget;
