import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useI18n } from "../context/I18nContext";
import { AdminComponentProps, ModelName } from "../types";
import ActionDropdownItem from "./ActionDropdownItem";
import Button from "./radix/Button";
import {
  Dropdown,
  DropdownBody,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "./radix/Dropdown";

type Props = {
  actions?: AdminComponentProps["actions"];
  id?: string | number;
  onDelete: () => void;
  canDelete?: boolean;
  resource: ModelName;
};

const ListActionsDropdown = ({
  actions,
  id,
  onDelete,
  canDelete,
  resource,
}: Props) => {
  const { t } = useI18n();

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-nextadmin-background-emphasis !px-2 py-2"
        >
          <EllipsisVerticalIcon className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-6 w-6" />
        </Button>
      </DropdownTrigger>
      <DropdownBody>
        <DropdownContent
          side="left"
          align="start"
          sideOffset={5}
          className="z-50 space-y-1.5 px-2 py-2"
        >
          {actions?.map((action) => {
            return (
              <ActionDropdownItem
                key={action.id}
                action={action}
                resourceIds={[id as string]}
                resource={resource}
              />
            );
          })}
          {canDelete && (
            <DropdownItem
              className={twMerge(
                clsx(
                  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-red-700 hover:bg-red-50 dark:text-red-400"
                )
              )}
              onClick={(evt) => {
                evt.stopPropagation();
                onDelete();
              }}
            >
              <TrashIcon className="h-5 w-5" />
              {t("list.row.actions.delete.label")}
            </DropdownItem>
          )}
        </DropdownContent>
      </DropdownBody>
    </Dropdown>
  );
};

export default ListActionsDropdown;
