import clsx from "clsx";
import { useState } from "react";
import DoubleArrow from "../../../assets/icons/DoubleArrow";
import { useConfig } from "../../../context/ConfigContext";
import { useFormState } from "../../../context/FormStateContext";
import { useI18n } from "../../../context/I18nContext";
import { useResource } from "../../../context/ResourceContext";
import useClickOutside from "../../../hooks/useCloseOnOutsideClick";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { Enumeration, Field, ModelName, SchemaProperty } from "../../../types";
import Button from "../../radix/Button";
import EmbeddedFormModal from "../EmbeddedForm/EmbeddedFormModal";
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
  propertySchema: SchemaProperty<ModelName>[Field<ModelName>];
};

const MultiSelectWidget = (props: Props) => {
  const { options: globalOptions } = useConfig();
  const { resource } = useResource();
  const { onToggle, isOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsOpen] = useState(false);
  const containerRef = useClickOutside<HTMLDivElement>(() => onClose());
  const { formData, onChange, options, name, propertySchema } = props;
  const { t } = useI18n();
  const { setFieldDirty } = useFormState();
  const fieldOptions =
    globalOptions?.model?.[resource!]?.edit?.fields?.[name as Field<ModelName>];

  const relationModel = 
    propertySchema?.relation || propertySchema?.items?.relation;

  const onRemoveClick = (value: any) => {
    setFieldDirty(name);
    onChange(formData?.filter((item: Enumeration) => item.value !== value));
  };

  const selectedValues = formData?.map((item: any) => item?.value) ?? [];

  const displayMode =
    !!fieldOptions && "display" in fieldOptions
      ? (fieldOptions.display ?? "select")
      : "select";

  const fieldSortable =
    displayMode === "list" &&
    // @ts-expect-error
    (!!fieldOptions?.orderField || !!propertySchema?.enum);

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
                  propertySchema={propertySchema}
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
            propertySchema={propertySchema}
            onRemoveClick={onRemoveClick}
            deletable={!props.disabled}
            sortable={fieldSortable}
            onUpdateFormData={(value) => {
              setFieldDirty(name);
              onChange(value);
            }}
          />
          {isModalOpen && (
            <EmbeddedFormModal
              originalResource={resource}
              resource={relationModel as ModelName}
              onClose={() => setIsOpen(false)}
            />
          )}
          <div className="flex gap-2">
            <Button
              aria-disabled={props.disabled}
              type="button"
              disabled={props.disabled}
              className="relative"
            >
              {select}
              {t("form.widgets.multiselect.select")}
            </Button>
            <Button
              aria-disabled={props.disabled}
              type="button"
              disabled={props.disabled}
              className="relative"
              onClick={() => setIsOpen(true)}
            >
              {t("form.widgets.multiselect.create")}
            </Button>
          </div>
        </div>
      )}
      {displayMode === "table" && (
        <div className="space-y-2">
          <MultiSelectDisplayTable
            formData={formData}
            propertySchema={propertySchema}
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
        name={name as Field<ModelName>}
        options={options?.length ? options : undefined}
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
