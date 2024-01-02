import { NextAdmin } from "@premieroctet/next-admin";
import { getPropsFromParams } from "@premieroctet/next-admin/dist/appRouter";
import { getMessages, getTranslations } from "next-intl/server";
import { deleteItem, submitFormAction } from "../../../../actions/nextadmin";
import Dashboard from "../../../../components/Dashboard";
import { options } from "../../../../options";
import { prisma } from "../../../../prisma";
import schema from "../../../../prisma/json-schema/json-schema.json";
import "../../../../styles.css";

export default async function AdminPage({
  params,
  searchParams,
}: Readonly<{
  params: { [key: string]: string[] };
  searchParams: { [key: string]: string | string[] | undefined } | undefined;
}>) {
  const props = await getPropsFromParams({
    params: params.nextadmin,
    searchParams,
    options,
    prisma,
    schema,
    action: submitFormAction,
    deleteAction: deleteItem,
  });

  //@ts-expect-error
  const messages = await getMessages({ locale: params.locale })

  const dotProperty = (json: object) => {
    const dottedJson = {} as any
    const dot = (obj: object, prefix = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object') {
          dot(value, `${prefix}${key}.`)
        } else {
          dottedJson[`${prefix}${key}`] = value
        }
      })
    }
    dot(json)
    return dottedJson
  }

  const dottedProperty = dotProperty(messages.admin)

  return (
    <NextAdmin
      {...props}
      dashboard={Dashboard}
      translations={JSON.stringify(dottedProperty)}
    />
  );
}
