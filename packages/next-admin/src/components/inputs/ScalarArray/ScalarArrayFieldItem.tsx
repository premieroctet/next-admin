import { ChangeEvent, cloneElement } from "react";
import { twMerge } from "tailwind-merge";
import { CustomInputProps } from "../../../types";
import BaseInput from "../BaseInput";
import DndItem from "../DndItem";
import { getClonableElement } from "../../../utils/react19-compat";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  onRemoveClick: () => void;
  inputValue: string;
  id: string;
  scalarType: string;
  customInput?: React.ReactElement<CustomInputProps>;
};

const ScalarArrayFieldItem = ({
  value,
  onChange,
  disabled,
  onRemoveClick,
  id,
  scalarType,
  customInput = <BaseInput />,
}: Props) => {
  const clonableElement = getClonableElement(customInput);
  const renderInput = () =>
    cloneElement(clonableElement, {
      ...clonableElement.props,
      value,
      onChange: (evt: ChangeEvent<HTMLInputElement>) =>
        onChange(evt.target.value),
      disabled,
      className: twMerge("w-full", clonableElement.props.className),
      type: scalarType === "number" ? "number" : "text",
    });

  return (
    <DndItem
      sortable={!disabled}
      deletable={!disabled}
      onRemoveClick={onRemoveClick}
      label={renderInput()}
      value={id}
    />
  );
};

export default ScalarArrayFieldItem;
