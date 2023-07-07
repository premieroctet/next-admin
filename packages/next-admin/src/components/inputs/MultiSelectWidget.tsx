import { useEffect, useRef, useState } from "react";
import DoubleArrow from "../../assets/icons/DoubleArrow";
import { Selector } from "./Selector";
import MultiSelectItem from "./MultiSelectItem";
import useCloseOnOutsideClick from "../../hooks/useCloseOnOutsideClick";

const MultiSelectWidget = (props: any) => {
  const { formData, onChange, options, name } = props;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useCloseOnOutsideClick(containerRef, () => setOpen(false));

  const onRemoveClick = (value: any) => {
    onChange(formData?.filter((item: any) => item !== value));
  };

  const values = formData?.map((item: any) =>
    options.find((option: any) => option.value === item)
  );
  const selectValue = values?.map((item: any) => item?.value) ?? [];
  const optionsLeft = options?.filter(
    (option: any) => !formData?.find((item: any) => item === option.value)
  );

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input type="hidden" name={name} value={JSON.stringify(selectValue)} />
        <div
          className="w-full px-3 py-2 pr-10 text-base placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm cursor-default flex space-x-2 min-h-[38px]"
          onClick={() => setOpen(!open)}
        >
          {values &&
            values.map(
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
        open={open}
        options={optionsLeft}
        name={name}
        onChange={(value: string) => {
          onChange([...(formData || []), value]);
        }}
      />
    </div>
  );
};

export default MultiSelectWidget;
