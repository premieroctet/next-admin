import * as OutlineIcons from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useClientActionDialog } from "../context/ClientActionDialogContext";
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
  const { open: openActionDialog } = useClientActionDialog();
  const isClientAction =
    "component" in action && "type" in action && action.type === "dialog";

  const Icon = action.icon && OutlineIcons[action.icon];

  return (
    <DropdownItem
      key={action.title}
      className={clsx(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1",
        {
          "text-red-700 dark:text-red-400": action.style === "destructive",
          "hover:bg-red-50": action.style === "destructive",
        }
      )}
      onClick={(evt) => {
        evt.stopPropagation();
        if (isClientAction) {
          openActionDialog({
            action: action,
            resource,
            resourceId: resourceIds[0],
          });
        } else {
          runAction(action);
        }
      }}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {t(action.title)}
    </DropdownItem>
  );
};

export default ActionDropdownItem;
