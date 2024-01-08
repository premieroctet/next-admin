import { NextAdmin } from "@premieroctet/next-admin";
import { getPropsFromParams } from "@premieroctet/next-admin/dist/appRouter";
import Dashboard from "../../../components/Dashboard";
import { options } from "../../../options";
import { prisma } from "../../../prisma";
import schema from "../../../prisma/json-schema/json-schema.json";
import { deleteItem, submitFormAction } from "../../../actions/nextadmin";
import "../../../styles.css";

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

  return <NextAdmin {...props} dashboard={Dashboard} />;
}
