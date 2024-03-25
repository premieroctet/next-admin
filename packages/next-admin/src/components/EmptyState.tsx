import { PlusSmallIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import { ModelIcon } from "../types";
import ResourceIcon from "./common/ResourceIcon";
import { buttonVariants } from "./radix/Button";

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
    <div className="text-center py-10">
      <ResourceIcon
        icon={icon ?? "RectangleGroupIcon"}
        className="mx-auto h-20 w-20 text-slate-300 stroke-1"
      />
      <h3 className="mt-2 font-semibold text-slate-800 text-lg">
        {t("list.empty.label", { resource: resource.toLowerCase() })}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {t("list.empty.caption", { resource: resource.toLowerCase() })}
      </p>
      <div className="mt-6">
        <Link
          href={`${basePath}/${resource}/new`}
          role="button"
          className={buttonVariants({
            variant: "default",
            size: "sm",
          })}
        >
          <span>
            {t("list.header.add.label")} {resource.toLowerCase()}
          </span>

          <PlusSmallIcon className="h-5 w-5 ml-2" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;
