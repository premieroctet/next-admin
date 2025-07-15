import type { PrismaClient } from "@premieroctet/next-admin";
import { createHandler } from "@premieroctet/next-admin/appHandler";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { options } from "../../options";
import prisma from "../../prisma";

const nextAdminApi = createHandler({
  prisma: prisma as PrismaClient,
  apiBasePath: "/api/admin",
  options,
});

export const ServerRoute = createServerFileRoute("/api/admin/$").methods({
  GET: ({ request, params }) => {
    return nextAdminApi.run(request, {
      params: Promise.resolve({
        nextadmin: params._splat?.split("/") ?? [],
      }),
    });
  },
  POST: ({ request, params }) => {
    return nextAdminApi.run(request, {
      params: Promise.resolve({
        nextadmin: params._splat?.split("/") ?? [],
      }),
    });
  },
  DELETE: ({ request, params }) => {
    return nextAdminApi.run(request, {
      params: Promise.resolve({
        nextadmin: params._splat?.split("/") ?? [],
      }),
    });
  },
  PUT: ({ request, params }) => {
    return nextAdminApi.run(request, {
      params: Promise.resolve({
        nextadmin: params._splat?.split("/") ?? [],
      }),
    });
  },
});
