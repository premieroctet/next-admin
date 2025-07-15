import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { WidgetProps } from "@rjsf/utils";
import clsx from "clsx";
import { ReactNode, useMemo, useState } from "react";
import DoubleArrow from "../../assets/icons/DoubleArrow";
import { useConfig } from "../../context/ConfigContext";
import { useFormState } from "../../context/FormStateContext";
import { useI18n } from "../../context/I18nContext";
import useClickOutside from "../../hooks/useCloseOnOutsideClick";
import { useDisclosure } from "../../hooks/useDisclosure";
import { Enumeration, Field, ModelName } from "../../types";
import { slugify } from "../../utils/tools";
import Link from "../common/Link";
import Button from "../radix/Button";
import EmbeddedFormModal from "./EmbeddedForm/EmbeddedFormModal";
import { Selector } from "./Selector";

const SelectWidget = ({
  options,
  onChange,
  value,
  disabled,
  required,
  formContext,
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
  const { t } = useI18n();

  const { basePath, options: globalOptions, resource, resourcesIdProperty } = useConfig();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fieldOptions =
    globalOptions?.model?.[resource!]?.edit?.fields?.[name as Field<ModelName>];

  // Check if allowCreate is enabled for this field
  const allowCreate = !!fieldOptions && "allowCreate" in fieldOptions && fieldOptions.allowCreate;

  // Check if allowEdit is enabled for this field
  const allowEdit = !!fieldOptions && "allowEdit" in fieldOptions && fieldOptions.allowEdit;

  const relatedModel = props.schema.relation as ModelName;
  const parentId = formContext?.parentId;

  const handleChange = (option: Enumeration | null) => {
    setFieldDirty(props.name);
    onChange(option);
    onClose();
  };

  const handleCreateSuccess = (newItemData: any) => {
    if (newItemData && resourcesIdProperty && relatedModel) {
      const idProperty = resourcesIdProperty[relatedModel];
      const newItem: Enumeration = {
        value: newItemData[idProperty],
        label: newItemData.toString?.() || newItemData[idProperty]?.toString() || "New Item",
        data: newItemData,
      };

      setFieldDirty(name);
      onChange(newItem);
    }
    setShowCreateModal(false);
  };

  const handleEditSuccess = (updatedItemData: any) => {
    if (updatedItemData && resourcesIdProperty && relatedModel) {
      const idProperty = resourcesIdProperty[relatedModel];
      const updatedItem: Enumeration = {
        value: updatedItemData[idProperty],
        label: updatedItemData.toString?.() || updatedItemData[idProperty]?.toString() || "Updated Item",
        data: updatedItemData,
      };

      setFieldDirty(name);
      onChange(updatedItem);
    }
    setShowEditModal(false);
  };

  const hasValue = useMemo(() => {
    return Object.keys(value || {}).length > 0;
  }, [value]);

  const createButton: ReactNode = allowCreate && relatedModel && !disabled ? (
    <div className="mt-2">
      <Button
        type="button"
        disabled={disabled}
        className="text-sm"
        onClick={() => setShowCreateModal(true)}
      >
        {t("form.widgets.select.create")}
      </Button>
    </div>
  ) : null;

  const editButton: ReactNode = allowEdit && relatedModel && !disabled && hasValue ? (
    <div className="mt-2">
      <Button
        type="button"
        disabled={disabled}
        className="text-sm ml-2"
        onClick={() => setShowEditModal(true)}
      >
        {t("form.widgets.select.edit")}
      </Button>
    </div>
  ) : null;

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
      {createButton}
      {editButton}
      <Selector
        ref={containerRef}
        open={isOpen}
        options={enumOptions?.length ? enumOptions : undefined}
        name={props.name}
        onChange={handleChange}
        selectedOptions={hasValue ? [value?.value] : []}
      />
      {showCreateModal && allowCreate && relatedModel ? (
        <EmbeddedFormModal
          originalResource={resource!}
          resource={relatedModel}
          parentId={parentId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      ) : null}
      {showEditModal && allowEdit && relatedModel && hasValue ? (
        <EmbeddedFormModal
          originalResource={resource!}
          resource={relatedModel}
          id={value?.value}
          parentId={parentId}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      ) : null}
    </div>
  );
};

export default SelectWidget;
