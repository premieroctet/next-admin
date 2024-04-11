import { PlusSmallIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import { ModelIcon } from "../types";
import ResourceIcon from "./common/ResourceIcon";
import { buttonVariants } from "./radix/Button";
import { slugify } from "../utils/tools";

const EmptyState = ({
  resource,
  icon,
}: {
  resource: string;
  icon?: ModelIcon;
}) => {
  const { t } = useI18n();
  const { basePath } = useConfig();

  return (
    <div className="py-10 text-center">
      <ResourceIcon
        icon={icon ?? "RectangleGroupIcon"}
        className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default mx-auto h-20 w-20 stroke-1"
      />
      <h3 className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-default mt-2 text-lg  font-semibold">
        {t("list.empty.label", { resource: resource.toLowerCase() })}
      </h3>
      <p className="text-nextadmin-content-emphasis dark:text-dark-nextadmin-content-emphasis mt-1 text-sm ">
        {t("list.empty.caption", { resource: resource.toLowerCase() })}
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
            {t("list.header.add.label")} {resource.toLowerCase()}
          </span>

          <PlusSmallIcon className="ml-2 h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;
