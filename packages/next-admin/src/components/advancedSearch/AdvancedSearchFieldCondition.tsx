import {
  Dropdown,
  DropdownBody,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "../radix/Dropdown";
import { Button } from "../radix/Button";
import { QueryCondition, UIQueryBlock } from "../../utils/advancedSearch";
import { useI18n } from "../../context/I18nContext";
import { useAdvancedSearchContext } from "./AdvancedSearchContext";

type Props = {
  uiBlock: UIQueryBlock;
};

const AdvancedSearchFieldCondition = ({ uiBlock }: Props) => {
  const { t } = useI18n();
  const { removeUiBlock, updateUiBlock } = useAdvancedSearchContext();

  if (uiBlock.type !== "filter") {
    return null;
  }

  const conditionToText = (condition: QueryCondition) => {
    return t("search.advanced.conditions." + condition);
  };

  const renderDropdownItems = () => {
    const commonValidConditions: QueryCondition[] = [
      "equals",
      "not",
      "in",
      "notIn",
    ];
    const extraConditions: QueryCondition[] = ["null", "nnull"];
    const textConditions: QueryCondition[] = [
      "search",
      "startsWith",
      "endsWith",
    ];
    const numberConditions: QueryCondition[] = ["lt", "lte", "gt", "gte"];

    if (uiBlock.contentType === "text") {
      commonValidConditions.push(...textConditions);
    } else {
      commonValidConditions.push(...numberConditions);
    }

    return [...commonValidConditions, ...extraConditions].map((condition) => {
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
        <DropdownContent className="p-2">
          {renderDropdownItems()}
        </DropdownContent>
      </DropdownBody>
    </Dropdown>
  );
};

export default AdvancedSearchFieldCondition;
