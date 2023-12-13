import { NextAdmin } from "@premieroctet/next-admin";
import { getPropsFromParams } from "@premieroctet/next-admin/dist/appRouter";
import { getTranslations } from "next-intl/server";
import Dashboard from "../../../../components/Dashboard";
import { options } from "../../../../options";
import { prisma } from "../../../../prisma";
import schema from "../../../../prisma/json-schema/json-schema.json";
import { deleteItem, submitFormAction } from "../../../../actions/nextadmin";
import "../../../../styles.css";

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: { [key: string]: string[] };
  searchParams: { [key: string]: string | string[] | undefined } | undefined;
}) {
  const props = await getPropsFromParams({
    params: params.nextadmin,
    searchParams,
    options,
    prisma,
    schema,
    action: submitFormAction,
    deleteAction: deleteItem,
  });

  const t = await getTranslations({
    locale: params.locale,
    namespace: "admin",
  });

  return (
    <NextAdmin
      {...props}
      dashboard={Dashboard}
      translations={{
        "actions.delete.label": t("actions.delete.label"),
        "actions.label": t("actions.label"),
        "form.button.delete.label": t("form.button.delete.label"),
        "form.button.save.label": t("form.button.save.label"),
        "form.widgets.file_upload.delete": t("form.widgets.file_upload.delete"),
        "form.widgets.file_upload.label": t("form.widgets.file_upload.label"),
        "list.empty.label": t("list.empty.label", {
          resource: "resource" in props ? props.resource : "",
        }),
        "list.footer.indicator.of": t("list.footer.indicator.of"),
        "list.footer.indicator.showing": t("list.footer.indicator.showing"),
        "list.footer.indicator.to": t("list.footer.indicator.to"),
        "list.header.add.label": t("list.header.add.label"),
        "list.header.search.placeholder": t("list.header.search.placeholder"),
        "list.row.actions.delete.label": t("list.row.actions.delete.label"),
        "actions.user.email": t("actions.user.email"),
      }}
    />
  );
}
