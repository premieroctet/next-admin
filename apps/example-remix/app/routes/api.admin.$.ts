import { createHandler } from "@premieroctet/next-admin/appHandler";
import type { PrismaClient } from "@premieroctet/next-admin";
import { LoaderFunctionArgs } from "@remix-run/node";
import { options } from "../options";
import prisma from "../prisma";

const nextAdminApi = createHandler({
  prisma: prisma as PrismaClient,
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
