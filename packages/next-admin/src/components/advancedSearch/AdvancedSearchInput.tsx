import { ChangeEvent } from "react";
import { UIQueryBlock } from "../../utils/advancedSearch";
import BaseInput from "../inputs/BaseInput";
import { useAdvancedSearchContext } from "./AdvancedSearchContext";
import { SwitchRoot, SwitchThumb } from "../radix/Switch";

type Props = {
  uiBlock: UIQueryBlock;
};

const AdvancedSearchInput = ({ uiBlock }: Props) => {
  const { updateUiBlock } = useAdvancedSearchContext();

  if (
    uiBlock.type !== "filter" ||
    uiBlock.condition === "nnull" ||
    uiBlock.condition === "null"
  ) {
    return null;
  }

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    let value = evt.target.value;

    updateUiBlock({
      ...uiBlock,
      value,
    });
  };

  if (uiBlock.contentType === "boolean") {
    return (
      <SwitchRoot
        checked={uiBlock.value as boolean}
        onCheckedChange={(checked) => {
          updateUiBlock({
            ...uiBlock,
            value: checked,
          });
        }}
      >
        <SwitchThumb />
      </SwitchRoot>
    );
  }

  return (
    <BaseInput
      type={
        uiBlock.contentType === "datetime"
          ? "datetime-local"
          : uiBlock.contentType
      }
      className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default flex min-w-[50px] flex-1"
      onChange={onChange}
      value={(uiBlock.value as string | number | null) ?? ""}
    />
  );
};

export default AdvancedSearchInput;
