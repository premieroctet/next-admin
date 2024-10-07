import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { WidgetProps } from "@rjsf/utils";
import clsx from "clsx";
import Link from "next/link";
import { useMemo } from "react";
import DoubleArrow from "../../assets/icons/DoubleArrow";
import { useConfig } from "../../context/ConfigContext";
import { useFormState } from "../../context/FormStateContext";
import useClickOutside from "../../hooks/useCloseOnOutsideClick";
import { useDisclosure } from "../../hooks/useDisclosure";
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
  const { isOpen, onToggle, onClose } = useDisclosure();
  const containerRef = useClickOutside<HTMLDivElement>(() => {
    onClose();
  });
  const name = props.name;
  options as { enumOptions: Enumeration[] };
  const enumOptions = options.enumOptions?.map(
    (option: any) => option.value as Enumeration
  );
  const { setFieldDirty } = useFormState();

  const { basePath } = useConfig();

  const handleChange = (option: Enumeration | null) => {
    setFieldDirty(props.name);
    onChange(option);
    onClose();
  };

  const hasValue = useMemo(() => {
    return Object.keys(value || {}).length > 0;
  }, [value]);

  return (
    <div className="relative">
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
          }}
          onClick={() => {
            if (!disabled) {
              onToggle();
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
                handleChange(null);
              }}
            >
              <XMarkIcon className="h-5 w-5 cursor-pointer text-gray-400" />
            </button>
          )}
          {!disabled && (
            <div
              className="flex items-center"
              onClick={(e) => {
                if (!disabled) {
                  onToggle();
                }
              }}
            >
              <DoubleArrow />
            </div>
          )}
        </div>
      </div>
      <Selector
        ref={containerRef}
        open={isOpen}
        options={enumOptions?.length ? enumOptions : undefined}
        name={props.name}
        onChange={handleChange}
        selectedOptions={hasValue ? [value?.value] : []}
      />
    </div>
  );
};

export default SelectWidget;
