import { DocumentIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";
import { AdminComponentProps, GridData, ModelName } from "../types";
import Link from "./common/Link";
import { useConfig } from "../context/ConfigContext";
import { slugify } from "../utils/tools";
import ListActionsDropdown from "./ListActionsDropdown";
import { twMerge } from "tailwind-merge";
import Checkbox from "./radix/Checkbox";

type Props = {
  item: GridData;
  resource: ModelName;
  actions: AdminComponentProps["actions"];
  onDelete: (id: string) => void;
  canDelete: boolean;
  selectionVisible: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
};

const DataGridItem = ({
  item,
  resource,
  actions,
  onDelete,
  canDelete,
  selectionVisible,
  selected,
  onSelect,
}: Props) => {
  const [imageIsLoaded, setImageIsLoaded] = useState(false);
  const { basePath } = useConfig();

  return (
    <Link
      href={`${basePath}/${slugify(resource)}/${item.id}`}
      className="group"
      role="button"
    >
      <figure className="flex w-full flex-col items-center gap-2">
        <div className="relative size-48 overflow-hidden rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumbnail}
            alt={item.title}
            className={clsx("size-full object-contain", {
              "opacity-0": !imageIsLoaded,
            })}
            onLoad={() => {
              setImageIsLoaded(true);
            }}
          />
          {!imageIsLoaded && (
            <div className="bg-nextadmin-menu-background dark:bg-dark-nextadmin-background-emphasis absolute inset-0 flex flex-col items-center justify-center rounded-md">
              <DocumentIcon className="text-nextadmin-text-subtle dark:text-dark-nextadmin-text-subtle size-16" />
            </div>
          )}
          <div className="absolute left-3 right-2 top-2 flex items-center justify-between">
            <div
              className={twMerge(
                clsx("invisible", {
                  "group-hover:visible": !selectionVisible,
                  visible: selectionVisible,
                })
              )}
              onClick={(e) => {
                e.preventDefault();
                onSelect(item.id as string);
              }}
            >
              <Checkbox checked={selected} />
            </div>
            <div className="invisible group-hover:visible">
              <ListActionsDropdown
                actions={actions}
                onDelete={() => onDelete(item.id as string)}
                resource={resource}
                canDelete={canDelete}
                id={item.id}
              />
            </div>
          </div>
        </div>
        <legend className="text-nextadmin-text-default dark:text-dark-nextadmin-text-default line-clamp-1 break-all">
          {item.title}
        </legend>
      </figure>
    </Link>
  );
};

export default DataGridItem;
