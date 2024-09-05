import BaseInput from "../BaseInput";
import DndItem from "../DndItem";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  onRemoveClick: () => void;
  inputValue: string;
  id: string;
  scalarType: string;
};

const ScalarArrayFieldItem = ({
  value,
  onChange,
  disabled,
  onRemoveClick,
  id,
  scalarType,
}: Props) => {
  const renderInput = () => {
    return (
      <BaseInput
        value={value}
        onChange={(evt) => onChange(evt.target.value)}
        disabled={disabled}
        className="w-full"
        type={scalarType === "number" ? "number" : "text"}
      />
    );
  };

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
