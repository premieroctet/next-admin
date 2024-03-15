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

  useEffect(() => {
    if (formContext.relationState?.[name]?.open) {
      // @ts-expect-error
      containerRef.current?.querySelector(`#${name}-search`)?.focus();
    }
  }, []);

  const hasValue = useMemo(() => {
    return Object.keys(value || {}).length > 0;
  }, [value]);

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative flex justify-between w-full px-3 py-2 text-base placeholder-gray-500 border border-gray-300 rounded-md shadow-sm sm:text-sm cursor-default">
        <input
          type="hidden"
          value={value?.value || ""}
          name={props.name}
          className="absolute -z-10 inset-0 w-full h-full opacity-0"
        />
        <input
          id={props.id}
          readOnly
          className="w-full h-full flex-1 appearance-none focus:outline-none cursor-default"
          value={value?.label || ""}
          onMouseDown={() => formContext.toggleOpen(name)}
        />
        <div className="flex space-x-3">
          {hasValue && props.schema.relation && (
            <Link
              href={`${basePath}/${props.schema.relation}/${value?.value}`}
              className="flex items-center"
            >
              <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
            </Link>
          )}
          {hasValue && (
            <div className="flex items-center" onClick={() => onChange({})}>
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div className="flex items-center pointer-events-none">
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
