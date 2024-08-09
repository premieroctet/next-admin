"use client";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import {
  EditFieldsOptions,
  FormProps,
  ModelOptions,
  Permission,
} from "../types";
import { getSchemas } from "../utils/jsonSchema";
import { slugify } from "../utils/tools";
import ActionsDropdown from "./ActionsDropdown";
import Breadcrumb from "./Breadcrumb";
import { buttonVariants } from "./radix/Button";

export default function FormHeader({
  title,
  slug,
  icon,
  actions,
  resource,
  data,
  schema,
  dmmfSchema,
}: FormProps) {
  const { t } = useI18n();
  const { basePath, options } = useConfig();
  const modelOptions: ModelOptions<typeof resource>[typeof resource] =
    options?.model?.[resource];
  const canCreate =
    !modelOptions?.permissions ||
    modelOptions?.permissions?.includes(Permission.CREATE);

  const { edit, id } = getSchemas(
    data,
    schema,
    dmmfSchema,
    modelOptions?.edit?.fields as EditFieldsOptions<typeof resource>
  );

  const breadcrumItems = [
    {
      label: t(`model.${resource}.plural`, {}, title),
      href: `${basePath}/${slugify(resource)}`,
      icon,
    },
    {
      label: edit ? t("actions.edit.label") : t("actions.create.label"),
      href: `${basePath}/${slugify(resource)}/${id}`,
      current: !edit,
    },
  ];

  if (edit && id) {
    breadcrumItems.push({
      label: slug ?? id.toString(),
      href: `${basePath}/${slugify(resource)}/${id}`,
      current: true,
    });
  }

  return (
    <div className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default dark:border-b-dark-nextadmin-border-default border-b-nextadmin-border-default sticky top-14 z-20 flex flex-row flex-wrap items-center justify-between gap-3 gap-4 border-b px-4 py-3 shadow-sm lg:top-0">
      <Breadcrumb breadcrumbItems={breadcrumItems} />
      <div className="flex items-center gap-2">
        {!!actions && actions.length > 0 && !!id && (
          <ActionsDropdown
            actions={actions}
            resource={resource}
            selectedIds={[id] as string[] | number[]}
            selectedCount={1}
          />
        )}
        {canCreate && (
          <Link
            href={`${basePath}/${slugify(resource)}/new`}
            role="button"
            data-testid="add-new-button"
            className={buttonVariants({
              variant: "default",
              size: "sm",
            })}
          >
            <span>{t("list.header.add.label")}</span>
            <PlusSmallIcon className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
