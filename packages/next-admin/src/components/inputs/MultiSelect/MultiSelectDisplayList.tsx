import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { RJSFSchema } from "@rjsf/utils";
import { Enumeration } from "../../../types";
import MultiSelectDisplayListItem from "./MultiSelectDisplayListItem";

type Props = {
  formData: any;
  schema: RJSFSchema;
  onRemoveClick: (value: Enumeration["value"]) => void;
  deletable: boolean;
  sortable?: boolean;
  onUpdateFormData?: (value: Enumeration[]) => void;
};

const MultiSelectDisplayList = ({
  formData,
  schema,
  onRemoveClick,
  deletable = true,
  sortable = false,
  onUpdateFormData,
}: Props) => {
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeIndex = formData.findIndex(
        (value: Enumeration) => value.value === active.id
      );
      const overIndex = formData.findIndex(
        (value: Enumeration) => value.value === over?.id
      );
      const newFormData = [...formData];
      newFormData.splice(overIndex, 0, newFormData.splice(activeIndex, 1)[0]);
      onUpdateFormData?.(newFormData);
    }
  };

  const renderList = () => {
    return (
      <ul className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted space-y-2">
        {formData?.map((value: Enumeration) => {
          return (
            <MultiSelectDisplayListItem
              item={value}
              key={value.value}
              onRemoveClick={onRemoveClick}
              deletable={deletable}
              sortable={sortable}
              schema={schema}
            />
          );
        })}
      </ul>
    );
  };

  if (!sortable) {
    return renderList();
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <SortableContext
        items={formData?.map((value: Enumeration) => value.value) ?? []}
      >
        {renderList()}
      </SortableContext>
    </DndContext>
  );
};

export default MultiSelectDisplayList;
