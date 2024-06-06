import { PlusSmallIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import { ModelIcon, ModelName } from "../types";
import { slugify } from "../utils/tools";
import ResourceIcon from "./common/ResourceIcon";
import { buttonVariants } from "./radix/Button";

const EmptyState = ({
  resource,
  icon,
}: {
  resource: ModelName;
  icon?: ModelIcon;
}) => {
  const { t } = useI18n();
  const { basePath, options } = useConfig();

  const modelOptions = options?.model?.[resource];
  const hasCreatePermission =
    !modelOptions?.permissions || modelOptions?.permissions?.includes("create");

  const resourceName = t(`model.${resource}.name`, {}, resource.toLowerCase());

  return (
    <div className="py-10 text-center">
      <ResourceIcon
        icon={icon ?? "RectangleGroupIcon"}
        className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default mx-auto h-20 w-20 stroke-1"
      />
      <h3 className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-default mt-2 text-lg  font-semibold">
        {t("list.empty.label", { resource: resourceName })}
      </h3>
      {hasCreatePermission && (
        <>
          <p className="text-nextadmin-content-emphasis dark:text-dark-nextadmin-content-emphasis mt-1 text-sm ">
            {t("list.empty.caption", { resource: resourceName })}
          </p>
          <div className="mt-6">
            <Link
              href={`${basePath}/${slugify(resource)}/new`}
              role="button"
              className={buttonVariants({
                variant: "default",
                size: "sm",
              })}
            >
              <span>
                {t("list.header.add.label")} {resourceName}
              </span>

              <PlusSmallIcon className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default EmptyState;
