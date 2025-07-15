import { RJSFSchema } from "@rjsf/utils";
import clsx from "clsx";
import { ReactNode, useState } from "react";
import DoubleArrow from "../../../assets/icons/DoubleArrow";
import { useConfig } from "../../../context/ConfigContext";
import { useFormState } from "../../../context/FormStateContext";
import { useI18n } from "../../../context/I18nContext";
import useClickOutside from "../../../hooks/useCloseOnOutsideClick";
import { useDisclosure } from "../../../hooks/useDisclosure";
import {
  Enumeration,
  Field,
  ModelName,
  RelationshipPagination,
} from "../../../types";
import { useFormData } from "../../../utils";
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
  schema: RJSFSchema;
  formContext?: any;
};

const MultiSelectWidget = (props: Props) => {
  const { options: globalOptions, resource, resourcesIdProperty } = useConfig();
  const { onToggle, isOpen, onClose } = useDisclosure();
  const containerRef = useClickOutside<HTMLDivElement>(() => onClose());
  const { formData, onChange, options, name, schema, formContext } = props;
  const { t } = useI18n();
  const { setFieldDirty } = useFormState();
  const fieldOptions =
    globalOptions?.model?.[resource!]?.edit?.fields?.[name as Field<ModelName>];
  const { relationshipsRawData } = useFormData();

  // State for embedded form modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const onRemoveClick = (value: any) => {
    setFieldDirty(name);
    onChange(formData?.filter((item: Enumeration) => item.value !== value));
  };

  const selectedValues = formData?.map((item: any) => item?.value) ?? [];

  const displayMode =
    !!fieldOptions && "display" in fieldOptions
      ? (fieldOptions.display ?? "select")
      : "select";

  const fieldPagination =
    !!fieldOptions && "pagination" in fieldOptions
      ? (fieldOptions.pagination as RelationshipPagination)
      : undefined;

  const fieldSortable =
    // @ts-expect-error
    displayMode === "list" && (!!fieldOptions?.orderField || !!schema.enum);

  // Check if allowCreate is enabled for this field
  const allowCreate = !!fieldOptions && "allowCreate" in fieldOptions && fieldOptions.allowCreate;

  // Check if allowEdit is enabled for this field
  const allowEdit = !!fieldOptions && "allowEdit" in fieldOptions && fieldOptions.allowEdit;

  // Get the related model name from schema
  // @ts-expect-error
  const relatedModel = schema.items?.relation as ModelName;
  const parentId = formContext?.parentId;

  // Handle successful creation of new item
  const handleCreateSuccess = (newItemData: any) => {
    if (newItemData && resourcesIdProperty) {
      const idProperty = resourcesIdProperty[relatedModel];
      const newItem: Enumeration = {
        value: newItemData[idProperty],
        label: newItemData.toString?.() || newItemData[idProperty]?.toString() || "New Item",
        data: newItemData,
      };

      setFieldDirty(name);
      onChange([...(formData || []), newItem]);
    }
    setShowCreateModal(false);
  };

  // Handle successful editing of existing item
  const handleEditSuccess = (updatedItemData: any) => {
    if (updatedItemData && resourcesIdProperty && editingItemId) {
      const idProperty = resourcesIdProperty[relatedModel];
      const updatedItem: Enumeration = {
        value: updatedItemData[idProperty],
        label: updatedItemData.toString?.() || updatedItemData[idProperty]?.toString() || "Updated Item",
        data: updatedItemData,
      };

      setFieldDirty(name);
      // Replace the edited item in the existing list
      const updatedFormData = (formData || []).map((item: Enumeration) =>
        item.value === editingItemId ? updatedItem : item
      );
      onChange(updatedFormData);
    }
    setShowEditModal(false);
    setEditingItemId(null);
  };

  const handleEditItem = (itemValue: string) => {
    setEditingItemId(itemValue);
    setShowEditModal(true);
  };

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

  const createButton: ReactNode = allowCreate && relatedModel && !props.disabled ? (
    <Button
      aria-disabled={props.disabled}
      type="button"
      disabled={props.disabled}
      className="relative"
      onClick={() => setShowCreateModal(true)}
    >
      {t("form.widgets.multiselect.create")}
    </Button>
  ) : null;

  const editButton: ReactNode = allowEdit && relatedModel && !props.disabled && formData?.length > 0 ? (
    <Button
      aria-disabled={props.disabled}
      type="button"
      disabled={props.disabled}
      className="relative ml-2"
      onClick={() => {
        // For multiselect, we could show a selection dialog or edit the first item
        // For now, let's edit the first selected item
        if (formData && formData.length > 0) {
          handleEditItem(formData[0].value);
        }
      }}
    >
      {t("form.widgets.multiselect.edit")}
    </Button>
  ) : null;

  return (
    <div className="relative">
      {displayMode === "select" && (
        <div>
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
          {createButton}
          {editButton}
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
            pagination={fieldPagination}
          />

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
            {createButton}
            {editButton}
          </div>
        </div>
      )}
      {displayMode === "table" && (
        <div className="space-y-2">
          <MultiSelectDisplayTable
            formData={formData}
            schema={schema}
            onRemoveClick={onRemoveClick}
            deletable={!props.disabled}
            pagination={fieldPagination}
            rawData={relationshipsRawData?.[name]}
          />

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
            {createButton}
            {editButton}
          </div>
        </div>
      )}

      <Selector
        ref={containerRef}
        open={isOpen}
        name={name}
        options={options?.length ? options : undefined}
        onChange={(option: Enumeration) => {
          setFieldDirty(name);
          onChange([...(formData || []), option]);
        }}
        selectedOptions={selectedValues}
      />

      {/* Embedded Form Modal for creating new items */}
      {showCreateModal && allowCreate && relatedModel ? (
        <EmbeddedFormModal
          originalResource={resource!}
          resource={relatedModel}
          parentId={parentId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      ) : null}
      {/* Embedded Form Modal for editing items */}
      {showEditModal && allowEdit && relatedModel && editingItemId ? (
        <EmbeddedFormModal
          originalResource={resource!}
          resource={relatedModel}
          id={editingItemId}
          parentId={parentId}
          onClose={() => {
            setShowEditModal(false);
            setEditingItemId(null);
          }}
          onSuccess={handleEditSuccess}
        />
      ) : null}
    </div>
  );
};

export default MultiSelectWidget;
