import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { WidgetProps } from "@rjsf/utils";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import DoubleArrow from "../../assets/icons/DoubleArrow";
import { useConfig } from "../../context/ConfigContext";
import { useForm } from "../../context/FormContext";
import useCloseOnOutsideClick from "../../hooks/useCloseOnOutsideClick";
import { Enumeration } from "../../types";
import { Selector } from "./Selector";
import { slugify } from "../../utils/tools";

const SelectWidget = ({ options, onChange, value, ...props }: WidgetProps) => {
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
      <div className="relative flex w-full cursor-default justify-between rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 shadow-sm">
        <input
          type="hidden"
          value={value?.value || ""}
          name={props.name}
          className="absolute inset-0 -z-10 h-full w-full opacity-0"
        />
        <input
          id={props.id}
          readOnly
          className="h-full w-full flex-1 cursor-default appearance-none focus:outline-none"
          value={value?.label || ""}
          onMouseDown={() => formContext.toggleOpen(name)}
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
          {hasValue && (
            <div className="flex items-center" onClick={() => onChange({})}>
              <XMarkIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div className="pointer-events-none flex items-center">
            <DoubleArrow />
          </div>
        </div>
      </div>
      <Selector
        open={!!formContext.relationState?.[name]?.open!}
        options={enumOptions?.length ? enumOptions : undefined}
        name={props.name}
        onChange={handleChange}
      />
    </div>
  );
};

export default SelectWidget;
