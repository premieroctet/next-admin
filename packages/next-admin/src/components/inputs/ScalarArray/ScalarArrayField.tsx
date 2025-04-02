import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { RJSFSchema } from "@rjsf/utils";
import { useEffect, useState } from "react";
import { useI18n } from "../../../context/I18nContext";
import { CustomInputProps } from "../../../types";
import Button from "../../radix/Button";
import ScalarArrayFieldItem from "./ScalarArrayFieldItem";

type Scalar = number | string;

type Props = {
  formData: Scalar[];
  onChange: (data: Scalar[]) => void;
  name: string;
  disabled: boolean;
  schema: RJSFSchema;
  customInput?: React.ReactElement<CustomInputProps>;
};

const ScalarArrayField = ({
  formData,
  onChange,
  name,
  disabled,
  schema,
  customInput,
}: Props) => {
  const { t } = useI18n();

  const [formDataList, setFormDataList] = useState(() =>
    formData.map((value) => ({
      id: crypto.randomUUID(),
      value,
    }))
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeIndex = formDataList.findIndex(
        (value) => value.id === active.id
      );
      const overIndex = formDataList.findIndex(
        (value) => value.id === over?.id
      );
      const newFormData = [...formDataList];
      newFormData.splice(overIndex, 0, newFormData.splice(activeIndex, 1)[0]);

      onChange(newFormData.map((val) => val.value));
      setFormDataList(newFormData);
    }
  };

  const renderList = () => {
    return formDataList.map((value) => {
      return (
        <ScalarArrayFieldItem
          key={value.id}
          value={value.value.toString()}
          onRemoveClick={() => {
            setFormDataList((prev) =>
              prev.filter((val) => val.id !== value.id)
            );

          }}
          inputValue={value.value.toString()}
          disabled={disabled}
          onChange={(newValue) => {
            setFormDataList((prev) =>
              prev.map((val) =>
                val.id === value.id ? { ...val, value: newValue } : val
              )
            );

          }}
          id={value.id}
          // @ts-expect-error
          scalarType={schema.items.type}
          customInput={customInput}
        />
      );
    });
  };

  const onAddNewItem = () => {
    setFormDataList((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        value: "",
      },
    ]);

  };

  useEffect(() => {
    onChange(formDataList.map((val) => val.value));
  }, [formDataList]);

  return (
    <div className="relative flex flex-col gap-3">
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(formDataList.map((val) => val.value))}
      />
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext items={formDataList.map((val) => val.id) ?? []}>
          {renderList()}
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        className="w-fit"
        disabled={disabled}
        onClick={onAddNewItem}
      >
        {t("form.widgets.scalar_array.add")}
      </Button>
    </div>
  );
};

export default ScalarArrayField;
