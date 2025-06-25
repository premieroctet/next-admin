import { createHandler } from "@premieroctet/next-admin/appHandler";
import { LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../prisma";
import { options } from "../options";

const nextAdminApi = createHandler({
  prisma,
  apiBasePath: "/api/admin",
  options,
});

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return nextAdminApi.run(request, {
    params: Promise.resolve({
      nextadmin: params["*"]!.split("/"),
    }),
  });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  return nextAdminApi.run(request, {
    params: Promise.resolve({
      nextadmin: params["*"]!.split("/"),
    }),
  });
};
