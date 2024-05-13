import { RJSFSchema } from "@rjsf/utils";
import clsx from "clsx";
import { useRef } from "react";
import DoubleArrow from "../../../assets/icons/DoubleArrow";
import { useForm } from "../../../context/FormContext";
import { useI18n } from "../../../context/I18nContext";
import useCloseOnOutsideClick from "../../../hooks/useCloseOnOutsideClick";
import { Enumeration, Field, ModelName } from "../../../types";
import Button from "../../radix/Button";
import { Selector } from "../Selector";
import MultiSelectDisplayList from "./MultiSelectDisplayList";
import MultiSelectDisplayTable from "./MultiSelectDisplayTable";
import MultiSelectItem from "./MultiSelectItem";

type Props = {
  options?: Enumeration[];
  onChange: (data: unknown) => unknown;
  formData: any;
  name: string;
  disabled: boolean;
  required?: boolean;
  schema: RJSFSchema;
};

const MultiSelectWidget = (props: Props) => {
  const formContext = useForm();
  const { formData, onChange, options, name, schema } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  useCloseOnOutsideClick(containerRef, () => formContext.setOpen(false, name));
  const fieldOptions =
    formContext.options?.model?.[formContext.resource!]?.edit?.fields?.[
      name as Field<ModelName>
    ];

  const onRemoveClick = (value: any) => {
    onChange(formData?.filter((item: Enumeration) => item.value !== value));
  };

  const selectedValues = formData?.map((item: any) => item?.value) ?? [];

  const optionsLeft = options?.filter(
    (option) =>
      !formData?.find((item: Enumeration) => item.value === option.value)
  );

  const displayMode =
    !!fieldOptions && "display" in fieldOptions
      ? fieldOptions.display ?? "select"
      : "select";

  return (
    <div className="relative" ref={containerRef}>
      <select
        name={name}
        className="absolute inset-0 -z-10 h-full w-full opacity-0"
        disabled={props.disabled}
        required={props.required}
      >
        {!(props.required && selectedValues.length === 0) && (
          <option value={JSON.stringify(selectedValues)} />
        )}
      </select>
      {displayMode === "select" && (
        <div className="relative">
          <div
            className={clsx(
              "dark:bg-dark-nextadmin-background-subtle dark:ring-dark-nextadmin-border-strong text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted dark:border-dark-nextadmin-border-default ring-nextadmin-border-default flex min-h-[38px] w-full cursor-default appearance-none flex-wrap gap-x-1 gap-y-1 rounded-md border-0 border-gray-300 px-2 py-1.5 pr-10 text-sm placeholder-gray-500 shadow-sm ring-1 ring-inset transition-all duration-300 placeholder:text-gray-400 sm:leading-6",
              {
                "cursor-not-allowed opacity-50 [&_*]:pointer-events-auto [&_*]:cursor-default":
                  props.disabled,
              }
            )}
            onClick={() => {
              if (!props.disabled) {
                formContext.toggleOpen(name);
              }
            }}
            aria-disabled={props.disabled}
          >
            {formData?.map(
              (value: any, index: number) =>
                value && (
                  <MultiSelectItem
                    key={index}
                    label={value.label}
                    onRemoveClick={() => onRemoveClick(value.value)}
                    deletable={!props.disabled}
                  />
                )
            )}
          </div>
          {!props.disabled && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <DoubleArrow />
            </div>
          )}
        </div>
      )}
      {displayMode === "list" && (
        <div className="space-y-2">
          <MultiSelectDisplayList
            formData={formData}
            schema={schema}
            onRemoveClick={onRemoveClick}
            deletable={!props.disabled}
          />
          <Button
            onClick={() => {
              if (!props.disabled) {
                formContext.toggleOpen(name);
              }
            }}
            aria-disabled={props.disabled}
            type="button"
            disabled={props.disabled}
          >
            {t("form.widgets.multiselect.select")}
          </Button>
        </div>
      )}
      {displayMode === "table" && (
        <div className="space-y-2">
          <MultiSelectDisplayTable
            formData={formData}
            schema={schema}
            onRemoveClick={onRemoveClick}
            deletable={!props.disabled}
          />
          <Button
            onClick={() => {
              if (!props.disabled) {
                formContext.toggleOpen(name);
              }
            }}
            aria-disabled={props.disabled}
            type="button"
            disabled={props.disabled}
          >
            {t("form.widgets.multiselect.select")}
          </Button>
        </div>
      )}

      <Selector
        open={!!formContext.relationState?.[name]?.open!}
        name={name}
        options={optionsLeft?.length ? optionsLeft : undefined}
        onChange={(option: Enumeration) => {
          onChange([...(formData || []), option]);
        }}
        selectedOptions={selectedValues}
      />
    </div>
  );
};

export default MultiSelectWidget;
