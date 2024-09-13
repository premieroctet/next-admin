export const APP_ROUTER_PAGE_TEMPLATE = `import { NextAdmin, PageProps } from "@premieroctet/next-admin";
import { getNextAdminProps } from "@premieroctet/next-admin/appRouter";
import prisma from "{{prismaClientPath}}";
import schema from "{{jsonSchemaPath}}";
import { createHandler } from "@premieroctet/next-admin/appHandler";
import "{{stylesPath}}";
import options from "{{optionsPath}}";

export default async function AdminPage({
  params,
  searchParams,
}: PageProps) {
  const props = await getNextAdminProps({
    params: params.nextadmin,
    searchParams,
    basePath: "{{pageBasePath}}",
    apiBasePath: "{{apiBasePath}}",
    prisma,
    schema,
    options
  });
 
  return <NextAdmin {...props}/>;
}
`;

export const APP_ROUTER_API_TEMPLATE = `import prisma from "{{prismaClientPath}}";
import schema from "{{jsonSchemaPath}}";
import { createHandler } from "@premieroctet/next-admin/appHandler";
import options from "{{optionsPath}}";

const { run } = createHandler({
  apiBasePath: "{{apiBasePath}}",
  prisma,
  schema,
  options
});
 
export { run as DELETE, run as GET, run as POST };
`;

export const PAGE_ROUTER_PAGE_TEMPLATE = `import { AdminComponentProps, NextAdmin } from "@premieroctet/next-admin";
import { getNextAdminProps } from "@premieroctet/next-admin/pageRouter";
import { GetServerSideProps } from "next";
import prisma from "{{prismaClientPath}}";
import schema from "{{jsonSchemaPath}}";
import options from "{{optionsPath}}";
import "{{stylesPath}}";
 
export default function Admin(props: AdminComponentProps) {
  return (
    <NextAdmin
      {...props}
      /*options*/
    />
  );
}
 
export const getServerSideProps: GetServerSideProps = async ({ req }) =>
  await getNextAdminProps({
    basePath: "{{pageBasePath}}",
    apiBasePath: "{{apiBasePath}}",
    prisma,
    schema,
    options
    req,
  });
`;

export const PAGE_ROUTER_API_TEMPLATE = `import prisma from "{{prismaClientPath}}";
import schema from "{{jsonSchemaPath}}";
import { createHandler } from "@premieroctet/next-admin/pageHandler";
import options from "{{optionsPath}}";
 
export const config = {
  api: {
    bodyParser: false,
  },
};
 
const { run } = createHandler({
  apiBasePath: "{{apiBasePath}}",
  prisma,
  schema,
  options,
});
 
export default run;
`;

export const writeToTemplate = (
  template: string,
  context: Record<string, string>
) => {
  return Object.entries(context).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`{{${key}}}`, "g"), value);
  }, template);
};
