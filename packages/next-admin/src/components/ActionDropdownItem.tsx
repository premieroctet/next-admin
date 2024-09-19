import clsx from "clsx";
import { useClientDialog } from "../context/ClientDialogContext";
import { useI18n } from "../context/I18nContext";
import { useAction } from "../hooks/useAction";
import { ModelAction, ModelName } from "../types";
import { DropdownItem } from "./radix/Dropdown";

type Props = {
  action: ModelAction<ModelName> | Omit<ModelAction<ModelName>, "action">;
  resource: ModelName;
  resourceIds: string[] | number[];
  data?: any;
};

const ActionDropdownItem = ({ action, resource, resourceIds, data }: Props) => {
  const { t } = useI18n();
  const { runAction } = useAction(resource, resourceIds);
  const isClientAction =
    "component" in action && "type" in action && action.type === "dialog";
  const { open } = useClientDialog();

  return (
    <DropdownItem
      key={action.title}
      className={clsx("cursor-pointer rounded-md px-2 py-1", {
        "text-red-700 dark:text-red-400": action.style === "destructive",
        "hover:bg-red-50": action.style === "destructive",
      })}
      onClick={(evt) => {
        evt.stopPropagation();
        if (isClientAction) {
          open({
            actionId: action.id,
            data: data,
            resource: resource,
            resourceId: resourceIds[0],
          });
        } else {
          runAction(action);
        }
      }}
    >
      {t(action.title)}
    </DropdownItem>
  );
};

export default ActionDropdownItem;
