import { createServerFileRoute } from "@tanstack/react-start/server";
import { createHandler } from "@premieroctet/next-admin/appHandler";
import prisma from "../../prisma";
import { options } from "../../options";

const nextAdminApi = createHandler({
  prisma,
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
