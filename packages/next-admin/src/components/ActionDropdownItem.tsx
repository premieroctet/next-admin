import * as OutlineIcons from "@heroicons/react/24/outline";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useClientActionDialog } from "../context/ClientActionDialogContext";
import { useI18n } from "../context/I18nContext";
import { useAction } from "../hooks/useAction";
import {
  ClientAction,
  ModelName,
  OutputModelAction,
  ServerAction,
} from "../types";
import { DropdownItem } from "./radix/Dropdown";
import { SimpleTooltip } from "./radix/Tooltip";

type Props = {
  action: OutputModelAction[number];
  resource: ModelName;
  resourceIds: string[] | number[];
};

const ActionDropdownItem = ({ action, resource, resourceIds }: Props) => {
  const { t } = useI18n();
  const { runAction } = useAction(resource, resourceIds);
  const { open: openActionDialog } = useClientActionDialog();
  const isClientAction =
    "component" in action && "type" in action && action.type === "dialog";

  const Icon = action.icon && OutlineIcons[action.icon];

  const enabledAction =
    action.allowedIds === undefined ||
    (action.allowedIds.length > 0 &&
      (resourceIds as (string | number)[]).every((id) =>
        action.allowedIds?.includes(id as never)
      ));

  if (!enabledAction && resourceIds.length === 1) {
    return null;
  }

  const component = (
    <DropdownItem
      key={action.title}
      disabled={!enabledAction}
      className={twMerge(
        clsx("flex cursor-pointer items-center gap-2 rounded-md px-2 py-1", {
          "text-red-700 dark:text-red-400": action.style === "destructive",
          "hover:bg-red-50": action.style === "destructive",
          "text-nextadmin-content-emphasis/50 dark:text-dark-nextadmin-content-emphasis/50 cursor-not-allowed":
            !enabledAction,
        })
      )}
      onClick={(evt) => {
        if (!enabledAction) return;
        evt.stopPropagation();
        if (isClientAction) {
          openActionDialog({
            action: action as ClientAction<typeof resource>,
            resource,
            resourceIds,
          });
        } else {
          runAction(action as ServerAction);
        }
      }}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {t(action.title)}
    </DropdownItem>
  );

  if (!enabledAction && resourceIds.length > 1) {
    return (
      <SimpleTooltip text={t("actions.some_failed_condition")}>
        {component}
      </SimpleTooltip>
    );
  }

  return component;
};

export default ActionDropdownItem;
