import { useRef } from "react";
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
          className="dark:bg-dark-nextadmin-background-subtle dark:ring-dark-nextadmin-border-strong text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted dark:border-dark-nextadmin-border-default ring-nextadmin-border-default flex min-h-[38px] w-full cursor-default appearance-none flex-wrap gap-x-1 gap-y-1 rounded-md border-0 border-gray-300 px-2 py-1.5 pr-10 text-sm placeholder-gray-500 shadow-sm ring-1 ring-inset transition-all duration-300 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6"
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
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
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
