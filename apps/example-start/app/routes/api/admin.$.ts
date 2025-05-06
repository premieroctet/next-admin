import { createHandler } from "@premieroctet/next-admin/appHandler";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import prisma from "database";
import { options } from "../../options";

const nextAdminApi = createHandler({
  prisma,
  apiBasePath: "/api/admin",
  options,
});

export const APIRoute = createAPIFileRoute("/api/admin/$")({
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
