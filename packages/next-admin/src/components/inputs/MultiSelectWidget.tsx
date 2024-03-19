import { useEffect, useRef } from "react";
import DoubleArrow from "../../assets/icons/DoubleArrow";
import { useForm } from "../../context/FormContext";
import useCloseOnOutsideClick from "../../hooks/useCloseOnOutsideClick";
import { Enumeration } from "../../types";
import MultiSelectItem from "./MultiSelectItem";
import { Selector } from "./Selector";

const MultiSelectWidget = (props: any) => {
  const formContext = useForm();
  const { formData, onChange, options, name } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  useCloseOnOutsideClick(containerRef, () => formContext.setOpen(false, name));

  const onRemoveClick = (value: any) => {
    onChange(formData?.filter((item: Enumeration) => item.value !== value));
  };

  const selectedValues = formData?.map((item: any) => item?.value) ?? [];

  const optionsLeft = options?.filter(
    (option: Enumeration) =>
      !formData?.find((item: Enumeration) => item.value === option.value)
  );

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input
          type="hidden"
          name={name}
          value={JSON.stringify(selectedValues)}
        />
        <div
          className="w-full px-3 py-2 pr-10 text-base placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none sm:text-sm cursor-default flex min-h-[38px] flex-wrap gap-x-1 gap-y-1"
          onClick={() => formContext.toggleOpen(name)}
        >
          {formData?.map(
            (value: any, index: number) =>
              value && (
                <MultiSelectItem
                  key={index}
                  label={value.label}
                  onRemoveClick={() => onRemoveClick(value.value)}
                />
              )
          )}
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <DoubleArrow />
        </div>
      </div>
      <Selector
        open={!!formContext.relationState?.[name]?.open!}
        name={name}
        options={optionsLeft?.length ? optionsLeft : undefined}
        onChange={(option: Enumeration) => {
          onChange([...(formData || []), option]);
        }}
      />
    </div>
  );
};

export default MultiSelectWidget;
