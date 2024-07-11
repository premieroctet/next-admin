import { RJSFSchema } from "@rjsf/utils";
import clsx from "clsx";
import DoubleArrow from "../../../assets/icons/DoubleArrow";
import { useConfig } from "../../../context/ConfigContext";
import { useFormState } from "../../../context/FormStateContext";
import { useI18n } from "../../../context/I18nContext";
import useClickOutside from "../../../hooks/useCloseOnOutsideClick";
import { useDisclosure } from "../../../hooks/useDisclosure";
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
  const { options: globalOptions, resource } = useConfig();
  const { onToggle, isOpen, onClose } = useDisclosure();
  const containerRef = useClickOutside<HTMLDivElement>(() => onClose());
  const { formData, onChange, options, name, schema } = props;
  const { t } = useI18n();
  const { setFieldDirty } = useFormState();
  const fieldOptions =
    globalOptions?.model?.[resource!]?.edit?.fields?.[name as Field<ModelName>];

  const onRemoveClick = (value: any) => {
    setFieldDirty(name);
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

  // @ts-expect-error
  const fieldSortable = displayMode === "list" && !!fieldOptions?.orderField;

  const select = (
    <select
      name={name}
      className={clsx(
        "absolute inset-0 h-full w-full opacity-0",
        props.disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
      disabled={props.disabled}
      required={props.required}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={() => {
        if (!props.disabled) {
          onToggle();
        }
      }}
    >
      {!(props.required && selectedValues.length === 0) && (
        <option value={JSON.stringify(selectedValues)} />
      )}
    </select>
  );

  return (
    <div className="relative">
      {displayMode === "select" && (
        <div
          className={clsx(
            "dark:bg-dark-nextadmin-background-subtle dark:ring-dark-nextadmin-border-strong text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted dark:border-dark-nextadmin-border-default ring-nextadmin-border-default flex min-h-[38px] w-[100%] w-full appearance-none flex-wrap gap-x-1 gap-y-1 rounded-md border-0 border-gray-300 px-2 py-1.5 pr-10 text-sm placeholder-gray-500 shadow-sm ring-1 ring-inset transition-all duration-300 placeholder:text-gray-400 sm:leading-6",
            {
              "cursor-not-allowed opacity-50": props.disabled,
            }
          )}
          aria-disabled={props.disabled}
        >
          {select}
          {formData?.map(
            (value: any, index: number) =>
              value && (
                <MultiSelectItem
                  key={index}
                  item={value}
                  schema={schema}
                  onRemoveClick={onRemoveClick}
                  deletable={!props.disabled}
                />
              )
          )}
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
            sortable={fieldSortable}
            onUpdateFormData={(value) => {
              setFieldDirty(name);
              onChange(value);
            }}
          />

          <Button
            aria-disabled={props.disabled}
            type="button"
            disabled={props.disabled}
            className="relative"
          >
            {select}
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
            aria-disabled={props.disabled}
            type="button"
            disabled={props.disabled}
            className="relative"
          >
            {select}
            {t("form.widgets.multiselect.select")}
          </Button>
        </div>
      )}

      <Selector
        ref={containerRef}
        open={isOpen}
        name={name}
        options={optionsLeft?.length ? optionsLeft : undefined}
        onChange={(option: Enumeration) => {
          setFieldDirty(name);
          onChange([...(formData || []), option]);
        }}
        selectedOptions={selectedValues}
      />
    </div>
  );
};

export default MultiSelectWidget;
