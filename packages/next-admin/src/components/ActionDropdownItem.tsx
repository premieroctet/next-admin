import clsx from "clsx";
import { useAction } from "../hooks/useAction";
import { ModelAction, ModelName } from "../types";
import { DropdownItem } from "./radix/Dropdown";
import { useI18n } from "../context/I18nContext";

type Props = {
  action: ModelAction | Omit<ModelAction, "action">;
  resource: ModelName;
  resourceIds: string[] | number[];
};

const ActionDropdownItem = ({ action, resource, resourceIds }: Props) => {
  const { t } = useI18n();
  const { runAction } = useAction(resource, resourceIds);

  return (
    <DropdownItem
      key={action.title}
      className={clsx("cursor-pointer rounded-md px-2 py-1", {
        "text-red-700 dark:text-red-400": action.style === "destructive",
        "hover:bg-red-50": action.style === "destructive",
      })}
      onClick={(evt) => {
        evt.stopPropagation();
        runAction(action);
      }}
    >
      {t(action.title)}
    </DropdownItem>
  );
};

export default ActionDropdownItem;
