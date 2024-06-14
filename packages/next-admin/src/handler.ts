import { PrismaClient } from "@prisma/client";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";
import { handleOptionsSearch } from "./handlers/options";
import { deleteResource, submitResource } from "./handlers/resources";
import { NextAdminOptions, Permission } from "./types";
import { hasPermission } from "./utils/permissions";
import { fetchDataList } from "./utils/prisma";
import {
  formatId,
  getFormValuesFromFormData,
  getResourceFromParams,
  getResources,
} from "./utils/server";

type RequestContext<P extends string> = {
  params: Record<P, string[]>;
};

type CreateAppHandlerParams<P extends string = "nextadmin"> = {
  /**
   * Next-admin options
   */
  options: NextAdminOptions;
  /**
   * Prisma client instance
   */
  prisma: PrismaClient;
  /**
   * A function that acts as a middleware. Useful to add authentication logic for example.
   */
  onRequest?: (
    req: NextRequest,
    ctx: RequestContext<P>
  ) =>
    | ReturnType<NextResponse["json"]>
    | ReturnType<NextResponse["text"]>
    | Promise<void>;
  /**
   * A string indicating the name of the dynamic segment.
   *
   * Example:
   * - If the dynamic segment is `[[...nextadmin]]`, then the `paramKey` should be `nextadmin`.
   * - If the dynamic segment is `[[...admin]]`, then the `paramKey` should be `admin`.
   *
   * @default "nextadmin"
   */
  paramKey?: P;
  /**
   * Generated JSON schema from Prisma
   */
  schema: any;
};

export const createAppHandler = <P extends string = "nextadmin">({
  options,
  prisma,
  paramKey = "nextadmin" as P,
  onRequest,
  schema,
}: CreateAppHandlerParams<P>) => {
  const router = createEdgeRouter<NextRequest, RequestContext<P>>();
  const resources = getResources(options);

  if (onRequest) {
    router.use(async (req, ctx, next) => {
      const response = await onRequest(req, ctx);

      if (response) {
        return response;
      }

      return next();
    });
  }

  router.get(`${options.apiBasePath}/:model`, async (req, ctx) => {
    const resource = getResourceFromParams(ctx.params[paramKey], resources);

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    const data = await fetchDataList({
      prisma,
      resource,
      options,
      searchParams,
    });

    return NextResponse.json(data);
  });

  router
    .post(`${options.apiBasePath}/:model/actions/:id`, async (req, ctx) => {
      const id = ctx.params[paramKey].at(-1)!;

      // Make sure we don't have a false positive with a model that could be named actions
      const resource = getResourceFromParams(
        [ctx.params[paramKey][0]],
        resources
      );

      if (!resource) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }

      const modelAction = options.model?.[resource]?.actions?.find(
        (action) => action.id === id
      );

      if (!modelAction) {
        return NextResponse.json(
          { error: "Action not found" },
          { status: 404 }
        );
      }

      const body = await req.json();

      try {
        await modelAction.action(body as string[] | number[]);

        return NextResponse.json({ ok: true });
      } catch (e) {
        return NextResponse.json(
          { error: (e as Error).message },
          { status: 500 }
        );
      }
    })
    .post(`${options.apiBasePath}/options`, async (req, ctx) => {
      const body = await req.json();
      const data = await handleOptionsSearch(body, prisma, options);

      return NextResponse.json(data);
    })
    .post(`${options.apiBasePath}/:model/:id?`, async (req, ctx) => {
      const resource = getResourceFromParams(ctx.params[paramKey], resources);

      if (!resource) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }

      const body = await getFormValuesFromFormData(await req.formData());
      const id =
        ctx.params[paramKey].length === 2
          ? formatId(resource, ctx.params[paramKey].at(-1)!)
          : undefined;

      try {
        const response = await submitResource({
          prisma,
          resource,
          body,
          id,
          options,
          schema,
        });

        if (response.error) {
          return NextResponse.json(
            { error: response.error, validation: response.validation },
            { status: 400 }
          );
        }

        return NextResponse.json(response, { status: id ? 200 : 201 });
      } catch (e) {
        return NextResponse.json(
          { error: (e as Error).message },
          { status: 500 }
        );
      }
    })
    .delete(`${options.apiBasePath}/:model/:id`, async (req, ctx) => {
      const resource = getResourceFromParams(ctx.params[paramKey], resources);

      if (!resource) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }

      if (!hasPermission(options.model?.[resource], Permission.DELETE)) {
        return NextResponse.json(
          { error: "You don't have permission to delete this resource" },
          { status: 403 }
        );
      }

      await deleteResource({
        body: [ctx.params[paramKey][1]],
        prisma,
        resource,
      });

      return NextResponse.json({ ok: true });
    })
    .delete(`${options.apiBasePath}/:model`, async (req, ctx) => {
      const resource = getResourceFromParams(ctx.params[paramKey], resources);

      if (!resource) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }

      if (!hasPermission(options.model?.[resource], Permission.DELETE)) {
        return NextResponse.json(
          { error: "You don't have permission to delete this resource" },
          { status: 403 }
        );
      }

      const body = await req.json();

      await deleteResource({ body, prisma, resource });

      return NextResponse.json({ ok: true });
    });

  const executeRouteHandler = (
    req: NextRequest,
    context: RequestContext<P>
  ) => {
    return router.run(req, context) as Promise<Response>;
  };

  return { run: executeRouteHandler, router };
};
