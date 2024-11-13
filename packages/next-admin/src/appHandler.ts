import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";
import { HookError } from "./exceptions/HookError";
import { handleOptionsSearch } from "./handlers/options";
import { deleteResource, submitResource } from "./handlers/resources";
import {
  CreateAppHandlerParams,
  ModelAction,
  Permission,
  RequestContext,
  ServerAction,
} from "./types";
import { hasPermission } from "./utils/permissions";
import { getRawData } from "./utils/prisma";
import {
  formatId,
  getFormValuesFromFormData,
  getResourceFromParams,
  getResources,
  globalSchema,
} from "./utils/server";

export const createHandler = <P extends string = "nextadmin">({
  apiBasePath,
  options,
  prisma,
  paramKey = "nextadmin" as P,
  onRequest,
}: CreateAppHandlerParams<P>) => {
  const router = createEdgeRouter<NextRequest, RequestContext<P>>();
  const resources = getResources(options);

  if (onRequest) {
    router.use(async (req, ctxPromise, next) => {
      const ctx = await ctxPromise;
      const response = await onRequest(req, ctx);

      if (response) {
        return response;
      }

      return next();
    });
  }

  router
    .get(`${apiBasePath}/:model/raw`, async (req, ctx) => {
      const params = await ctx.params;
      const resource = getResourceFromParams(params[paramKey], resources);

      if (!resource) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }

      const ids = req.nextUrl.searchParams
        .get("ids")
        ?.split(",")
        .map((id) => formatId(resource, id));

      const depth = req.nextUrl.searchParams.get("depth");

      if (!ids) {
        return NextResponse.json({ error: "No ids provided" }, { status: 400 });
      }

      if (depth && isNaN(Number(depth))) {
        return NextResponse.json(
          { error: "Depth should be a number" },
          { status: 400 }
        );
      }

      const data = await getRawData({
        prisma,
        resource,
        resourceIds: ids,
        maxDepth: depth ? Number(depth) : undefined,
      });

      return NextResponse.json(data);
    })
    .post(`${apiBasePath}/:model/actions/:id`, async (req, ctx) => {
      const params = await ctx.params;
      const id = params[paramKey].at(-1)!;

      // Make sure we don't have a false positive with a model that could be named actions
      const resource = getResourceFromParams([params[paramKey][0]], resources);

      if (!resource) {
        return NextResponse.json(
          { type: "error", message: "Resource not found" },
          { status: 404 }
        );
      }

      const modelAction = (
        options?.model?.[resource]?.actions as ModelAction<typeof resource>[]
      )?.find((action) => action.id === id);

      if (!modelAction) {
        return NextResponse.json(
          { type: "error", message: "Action not found" },
          { status: 404 }
        );
      }

      if ("type" in modelAction && modelAction.type === "dialog") {
        return NextResponse.json(
          { type: "error", message: "Action not found" },
          { status: 404 }
        );
      }

      const body = await req.json();

      try {
        const result = await (modelAction as ServerAction).action(
          body as string[] | number[]
        );

        return NextResponse.json(result ?? null);
      } catch (e) {
        return NextResponse.json(
          { type: "error", message: (e as Error).message },
          { status: 500 }
        );
      }
    })
    .post(`${apiBasePath}/options`, async (req, _ctx) => {
      const body = await req.json();
      const data = await handleOptionsSearch(body, prisma, options);

      return NextResponse.json(data);
    })
    .post(`${apiBasePath}/:model/:id?`, async (req, ctx) => {
      const params = await ctx.params;
      const resource = getResourceFromParams(params[paramKey], resources);

      if (!resource) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }

      const body = await getFormValuesFromFormData(await req.formData());
      const id =
        params[paramKey].length === 2
          ? formatId(resource, params[paramKey].at(-1)!)
          : undefined;

      const editOptions = options?.model?.[resource]?.edit;

      const mode = !!id ? "edit" : "create";

      try {
        const transformedBody = await editOptions?.hooks?.beforeDb?.(
          body,
          mode,
          req
        );

        let response = await submitResource({
          prisma,
          resource,
          body: transformedBody ?? body,
          id,
          options,
          schema: globalSchema,
        });

        if (response.error) {
          return NextResponse.json(
            { error: response.error, validation: response.validation },
            { status: 400 }
          );
        }

        response =
          (await editOptions?.hooks?.afterDb?.(response, mode, req)) ??
          response;

        return NextResponse.json(response, { status: id ? 200 : 201 });
      } catch (e) {
        if (e instanceof HookError) {
          return NextResponse.json(e.data, { status: e.status });
        }

        return NextResponse.json(
          { error: (e as Error).message },
          { status: 500 }
        );
      }
    })
    .delete(`${apiBasePath}/:model/:id`, async (req, ctx) => {
      const params = await ctx.params;
      const resource = getResourceFromParams(params[paramKey], resources);

      if (!resource) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }

      if (!hasPermission(options?.model?.[resource], Permission.DELETE)) {
        return NextResponse.json(
          { error: "You don't have permission to delete this resource" },
          { status: 403 }
        );
      }

      await deleteResource({
        body: [params[paramKey][1]],
        prisma,
        resource,
      });

      return NextResponse.json({ ok: true });
    })
    .delete(`${apiBasePath}/:model`, async (req, ctx) => {
      const params = await ctx.params;
      const resource = getResourceFromParams(params[paramKey], resources);

      if (!resource) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }

      if (!hasPermission(options?.model?.[resource], Permission.DELETE)) {
        return NextResponse.json(
          { error: "You don't have permission to delete this resource" },
          { status: 403 }
        );
      }
      try {
        const body = await req.json();

        await deleteResource({ body, prisma, resource });

        return NextResponse.json({ ok: true });
      } catch (e) {
        return NextResponse.json(
          { error: (e as Error).message },
          { status: 500 }
        );
      }
    });

  const executeRouteHandler = (
    req: NextRequest,
    context: RequestContext<P>
  ) => {
    return router.run(req, context) as Promise<Response>;
  };

  return { run: executeRouteHandler, router };
};
