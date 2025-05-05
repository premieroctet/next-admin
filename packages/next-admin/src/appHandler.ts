import { createEdgeRouter } from "next-connect";
import { HookError } from "./exceptions/HookError";
import { handleOptionsSearch } from "./handlers/options";
import { deleteResource, submitResource } from "./handlers/resources";
import {
  CreateAppHandlerParams,
  EditFieldsOptions,
  ListData,
  ListDataFieldValue,
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
  getModelIdProperty,
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
  const router = createEdgeRouter<Request, RequestContext<P>>();
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
        return Response.json({ error: "Resource not found" }, { status: 404 });
      }
      const searchParams = new URL(req.url).searchParams;

      const ids = searchParams
        .get("ids")
        ?.split(",")
        .map((id) => formatId(resource, id));

      const depth = searchParams.get("depth");

      if (!ids) {
        return Response.json({ error: "No ids provided" }, { status: 400 });
      }

      if (depth && isNaN(Number(depth))) {
        return Response.json(
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

      return Response.json(data);
    })
    .post(`${apiBasePath}/:model/actions/:id`, async (req, ctx) => {
      const params = await ctx.params;
      const id = params[paramKey].at(-1)!;

      // Make sure we don't have a false positive with a model that could be named actions
      const resource = getResourceFromParams([params[paramKey][0]], resources);

      if (!resource) {
        return Response.json(
          { type: "error", message: "Resource not found" },
          { status: 404 }
        );
      }

      const modelAction = (
        options?.model?.[resource]?.actions as ModelAction<typeof resource>[]
      )?.find((action) => action.id === id);

      if (!modelAction) {
        return Response.json(
          { type: "error", message: "Action not found" },
          { status: 404 }
        );
      }

      if ("type" in modelAction && modelAction.type === "dialog") {
        return Response.json(
          { type: "error", message: "Action not found" },
          { status: 404 }
        );
      }

      const body = await req.json();

      try {
        const result = await (modelAction as ServerAction).action(
          body as string[] | number[]
        );

        return Response.json(result ?? null);
      } catch (e) {
        return Response.json(
          { type: "error", message: (e as Error).message },
          { status: 500 }
        );
      }
    })
    .post(`${apiBasePath}/options`, async (req, _ctx) => {
      const body = await req.json();
      const data = await handleOptionsSearch(body, prisma, options);

      return Response.json(data);
    })
    .post(`${apiBasePath}/:model/order`, async (req, ctx) => {
      const body = await req.json();
      const params = await ctx.params;
      const resource = getResourceFromParams(params[paramKey], resources);
      const optimisticData = body as ListData<NonNullable<typeof resource>>;

      if (!resource) {
        return Response.json({ error: "Resource not found" }, { status: 404 });
      }

      if (!resource) {
        return Response.json({ error: "Resource not found" }, { status: 404 });
      }

      const resourceIdField = getModelIdProperty(resource);
      const orderField = options?.model?.[resource]?.list?.orderField;

      if (!orderField) {
        return Response.json(
          { error: "Order field not found" },
          { status: 404 }
        );
      }

      await prisma.$transaction(async (tx) => {
        for (const item of optimisticData) {
          //@ts-expect-error
          await tx[resource].update({
            where: { [resourceIdField]: item[resourceIdField].value },
            data: {
              [orderField]: (item[orderField] as ListDataFieldValue).value,
            },
          });
        }
      });

      return Response.json({ ok: true });
    })
    .post(`${apiBasePath}/:model/:id?`, async (req, ctx) => {
      const params = await ctx.params;
      const resource = getResourceFromParams(params[paramKey], resources);

      if (!resource) {
        return Response.json({ error: "Resource not found" }, { status: 404 });
      }

      const body = await getFormValuesFromFormData(
        await req.formData(),
        options?.model?.[resource]?.edit?.fields as EditFieldsOptions<
          typeof resource
        >
      );
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
          return Response.json(
            { error: response.error, validation: response.validation },
            { status: 400 }
          );
        }

        response =
          (await editOptions?.hooks?.afterDb?.(response, mode, req)) ??
          response;

        return Response.json(response, { status: id ? 200 : 201 });
      } catch (e) {
        if (e instanceof HookError) {
          return Response.json(e.data, { status: e.status });
        }

        return Response.json({ error: (e as Error).message }, { status: 500 });
      }
    })
    .delete(`${apiBasePath}/:model/:id`, async (req, ctx) => {
      const params = await ctx.params;
      const resource = getResourceFromParams(params[paramKey], resources);

      if (!resource) {
        return Response.json({ error: "Resource not found" }, { status: 404 });
      }

      if (!hasPermission(options?.model?.[resource], Permission.DELETE)) {
        return Response.json(
          { error: "You don't have permission to delete this resource" },
          { status: 403 }
        );
      }

      try {
        const deleted = await deleteResource({
          body: [params[paramKey][1]],
          prisma,
          resource,
          modelOptions: options?.model?.[resource],
        });

        if (!deleted) {
          throw new Error("Deletion failed");
        }

        return Response.json({ ok: true });
      } catch (e) {
        return Response.json({ error: (e as Error).message }, { status: 500 });
      }
    })
    .delete(`${apiBasePath}/:model`, async (req, ctx) => {
      const params = await ctx.params;
      const resource = getResourceFromParams(params[paramKey], resources);

      if (!resource) {
        return Response.json({ error: "Resource not found" }, { status: 404 });
      }

      if (!hasPermission(options?.model?.[resource], Permission.DELETE)) {
        return Response.json(
          { error: "You don't have permission to delete this resource" },
          { status: 403 }
        );
      }
      try {
        const body = await req.json();

        await deleteResource({
          body,
          prisma,
          resource,
          modelOptions: options?.model?.[resource],
        });

        return Response.json({ ok: true });
      } catch (e) {
        return Response.json({ error: (e as Error).message }, { status: 500 });
      }
    });

  const executeRouteHandler = (req: Request, context: RequestContext<P>) => {
    return router.run(req, context) as Promise<Response>;
  };

  return { run: executeRouteHandler, router };
};
