import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChangeEvent } from "react";
import { UIQueryBlock } from "../../utils/advancedSearch";
import BaseInput from "../inputs/BaseInput";
import Button from "../radix/Button";
import Checkbox from "../radix/Checkbox";
import {
  Dropdown,
  DropdownBody,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "../radix/Dropdown";
import { SwitchRoot, SwitchThumb } from "../radix/Switch";
import { useAdvancedSearchContext } from "./AdvancedSearchContext";

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

  if (uiBlock.contentType === "enum") {
    const selectedValues = (uiBlock.value as string)
      .split(",")
      .map((val) => val.trim())
      .filter(Boolean);
    return (
      <Dropdown>
        <DropdownTrigger asChild>
          <Button
            variant="ghost"
            className="dark:border-dark-nextadmin-border-strong justify-between gap-2 border"
          >
            <div className="flex items-center gap-2">
              {selectedValues.join(", ")}
            </div>
            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DropdownTrigger>
        <DropdownBody>
          <DropdownContent
            className="z-[999] max-h-[300px] w-[max(var(--radix-dropdown-menu-trigger-width),_200px)] overflow-y-auto p-2"
            avoidCollisions
            sideOffset={4}
            align="start"
          >
            {["equals", "not"].includes(uiBlock.condition)
              ? uiBlock.enum?.map((value) => (
                  <DropdownItem
                    key={value}
                    className="cursor-pointer rounded-md p-2"
                    defaultChecked={uiBlock.defaultValue === value}
                    onClick={() => {
                      updateUiBlock({
                        ...uiBlock,
                        value,
                      });
                    }}
                  >
                    {value}
                  </DropdownItem>
                ))
              : uiBlock.enum?.map((value) => {
                  return (
                    <DropdownItem
                      key={value}
                      className="flex cursor-pointer items-center gap-2 rounded-md p-2"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <Checkbox
                        id={value}
                        name={value}
                        checked={selectedValues?.includes(value)}
                        onCheckedChange={(checked) => {
                          updateUiBlock({
                            ...uiBlock,
                            value: checked
                              ? [...selectedValues, value].join(",")
                              : selectedValues
                                  .filter((v) => v !== value)
                                  .join(","),
                          });
                        }}
                      />
                      <label
                        htmlFor={value}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 cursor-pointer select-none"
                      >
                        {value}
                      </label>
                    </DropdownItem>
                  );
                })}
          </DropdownContent>
        </DropdownBody>
      </Dropdown>
    );
  }

  return (
    <BaseInput
      type={
        uiBlock.contentType === "datetime"
          ? "datetime-local"
          : uiBlock.contentType
      }
      className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default flex w-auto max-w-[100px] md:max-w-[160px]"
      onChange={onChange}
      value={(uiBlock.value as string | number | null) ?? ""}
    />
  );
};

export default AdvancedSearchInput;
