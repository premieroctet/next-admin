import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { WidgetProps } from "@rjsf/utils";
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
      <div className="ring-nextadmin-border-default dark:ring-dark-nextadmin-border-strong dark:bg-dark-nextadmin-background-subtle relative flex w-full cursor-default justify-between rounded-md px-3 py-2 text-sm placeholder-gray-500 shadow-sm ring-1">
        <select
          name={name}
          className="absolute inset-0 -z-10 h-full w-full opacity-0"
          disabled={props.disabled}
          required={required}
        >
          {!(props.required && value?.value) && <option value={value?.value} />}
        </select>
        <input
          id={props.id}
          readOnly
          className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted h-full w-full flex-1 cursor-default appearance-none bg-transparent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          value={value?.label ?? ""}
          disabled={disabled}
          onMouseDown={() => {
            if (!disabled) {
              formContext.toggleOpen(name);
            }
          }}
        />
        <div className="flex space-x-3">
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
            <div className="flex items-center" onClick={() => onChange({})}>
              <XMarkIcon className="h-5 w-5 cursor-pointer text-gray-400" />
            </div>
          )}
          {!disabled && (
            <div
              className="flex cursor-pointer items-center"
              onMouseDown={() => formContext.toggleOpen(name)}
            >
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
