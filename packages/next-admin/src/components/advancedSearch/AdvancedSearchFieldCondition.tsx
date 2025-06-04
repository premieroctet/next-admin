import { useEffect } from "react";
import { useI18n } from "../../context/I18nContext";
import { QueryCondition, UIQueryBlock } from "../../utils/advancedSearch";
import { Button } from "../radix/Button";
import {
  Dropdown,
  DropdownBody,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "../radix/Dropdown";
import { useAdvancedSearchContext } from "./AdvancedSearchContext";

type Props = {
  uiBlock: UIQueryBlock;
};

const AdvancedSearchFieldCondition = ({ uiBlock }: Props) => {
  const { t } = useI18n();
  const { updateUiBlock } = useAdvancedSearchContext();

  useEffect(() => {
    if (uiBlock.type === "filter") {
      const condition = uiBlock.condition;
      if ((condition === "equals" || condition === "not") && uiBlock.enum) {
        updateUiBlock({
          ...uiBlock,
          condition,
          value: Boolean(uiBlock.value)
            ? String(uiBlock.value)
                ?.split(",")
                .map((v) => v.trim())[0]
            : (uiBlock.defaultValue ?? null),
        });
      }
    }
    // @ts-expect-error
  }, [uiBlock.condition]);

  if (uiBlock.type !== "filter") {
    return null;
  }

  const conditionToText = (condition: QueryCondition) => {
    return t("search.advanced.conditions." + condition);
  };

  const renderDropdownItems = () => {
    const commonValidConditions: QueryCondition[] = ["equals", "not"];
    const extraConditions: QueryCondition[] = ["null", "nnull"];

    // Content type specific conditions
    const nonBooleanConditions: QueryCondition[] = ["in", "notIn"];
    const textConditions: QueryCondition[] = [
      "search",
      "startsWith",
      "endsWith",
    ];
    const numberConditions: QueryCondition[] = ["lt", "lte", "gt", "gte"];

    if (
      uiBlock.contentType !== "boolean" &&
      uiBlock.contentType !== "datetime"
    ) {
      commonValidConditions.push(...nonBooleanConditions);
    }

    if (uiBlock.contentType === "text") {
      commonValidConditions.push(...textConditions);
    } else if (
      uiBlock.contentType === "number" ||
      uiBlock.contentType === "datetime"
    ) {
      commonValidConditions.push(...numberConditions);
    }

    const conditions = [...commonValidConditions];

    if (uiBlock.nullable) {
      conditions.push(...extraConditions);
    }

    return conditions.map((condition) => {
      return (
        <DropdownItem
          key={condition}
          className="cursor-pointer rounded-md p-2"
          onClick={(e) => {
            e.stopPropagation();

            if (condition === "null" || condition === "nnull") {
              updateUiBlock({ ...uiBlock, condition, value: null });
            } else {
              updateUiBlock({ ...uiBlock, condition });
            }
          }}
        >
          {conditionToText(condition)}
        </DropdownItem>
      );
    });
  };

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="ghost" size="sm">
          {conditionToText(uiBlock.condition)}
        </Button>
      </DropdownTrigger>
      <DropdownBody>
        <DropdownContent className="z-[999] p-2" align="start">
          {renderDropdownItems()}
        </DropdownContent>
      </DropdownBody>
    </Dropdown>
  );
};

export default AdvancedSearchFieldCondition;
