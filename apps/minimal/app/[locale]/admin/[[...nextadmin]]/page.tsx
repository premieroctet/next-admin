import { NextAdmin, getNextAdminProps } from "@premieroctet/next-admin";
import "../../../../styles.css"

export default async function AdminPage({ params, searchParams }: any) {
  const nextAdminProps = await getNextAdminProps({
    basePath: "/admin",
    apiBasePath: "/api/admin",
    params: params.nextadmin as string[],
    searchParams: searchParams!,
  });
  return <NextAdmin {...nextAdminProps} />;
}
