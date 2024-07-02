import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler, createRouter } from "next-connect";
import { handleOptionsSearch } from "./handlers/options";
import { deleteResource, submitResource } from "./handlers/resources";
import { NextAdminOptions, Permission } from "./types";
import { hasPermission } from "./utils/permissions";
import {
  formatId,
  getFormDataValues,
  getJsonBody,
  getResourceFromParams,
  getResources,
} from "./utils/server";

type CreateAppHandlerParams<P extends string = "nextadmin"> = {
  /**
   * `apiBasePath` is a string that represents the base path of the admin API route. (e.g. `/api`) - optional.
   */
  apiBasePath: string;
  /**
   * Next-admin options
   */
  options?: NextAdminOptions;
  /**
   * Prisma client instance
   */
  prisma: PrismaClient;
  /**
   * A function that acts as a middleware. Useful to add authentication logic for example.
   */
  onRequest?: (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => Promise<void>;
  // /**
  //  * A string indicating the name of the dynamic segment.
  //  *
  //  * Example:
  //  * - If the dynamic segment is `[[...nextadmin]]`, then the `paramKey` should be `nextadmin`.
  //  * - If the dynamic segment is `[[...admin]]`, then the `paramKey` should be `admin`.
  //  *
  //  * @default "nextadmin"
  //  */
  paramKey?: P;
  /**
   * Generated JSON schema from Prisma
   */
  schema: any;
};

export const createHandler = <P extends string = "nextadmin">({
  apiBasePath,
  options,
  prisma,
  paramKey = "nextadmin" as P,
  onRequest,
  schema,
}: CreateAppHandlerParams<P>) => {
  const router = createRouter<NextApiRequest, NextApiResponse>();
  const resources = getResources(options);

  if (onRequest) {
    router.use(onRequest);
  }

  router
    .post(`${apiBasePath}/:model/actions/:id`, async (req, res) => {
      const id = req.query[paramKey]!.at(-1)!;

      // Make sure we don't have a false positive with a model that could be named actions
      const resource = getResourceFromParams(
        [req.query[paramKey]![0]],
        resources
      );

      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      const modelAction = options?.model?.[resource]?.actions?.find(
        (action) => action.id === id
      );

      if (!modelAction) {
        return res.status(404).json({ error: "Action not found" });
      }

      let body;

      try {
        body = await getJsonBody(req);
      } catch {
        return res.status(400).json({ error: "Invalid JSON body" });
      }

      try {
        await modelAction.action(body);

        return res.json({ ok: true });
      } catch (e) {
        return res.status(500).json({ error: (e as Error).message });
      }
    })
    .post(`${apiBasePath}/options`, async (req, res) => {
      let body;

      try {
        body = await getJsonBody(req);
      } catch {
        return res.status(400).json({ error: "Invalid JSON body" });
      }

      const data = await handleOptionsSearch(body, prisma, options);

      return res.json(data);
    })
    .post(`${apiBasePath}/:model/:id?`, async (req, res) => {
      const resource = getResourceFromParams(
        [req.query[paramKey]![0]],
        resources
      );

      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      const body = await getFormDataValues(req);
      const id =
        req.query[paramKey]!.length === 2
          ? formatId(resource, req.query[paramKey]!.at(-1)!)
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
          return res.status(400).json({
            error: response.error,
            validation: response.validation,
          });
        }

        return res.status(id ? 200 : 201).json(response);
      } catch (e) {
        return res.status(500).json({ error: (e as Error).message });
      }
    })
    .delete(`${apiBasePath}/:model/:id`, async (req, res) => {
      const resource = getResourceFromParams(
        [req.query[paramKey]![0]],
        resources
      );

      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      if (!hasPermission(options?.model?.[resource], Permission.DELETE)) {
        return res.status(403).json({
          error: "You don't have permission to delete this resource",
        });
      }

      try {
        await deleteResource({
          body: [req.query[paramKey]![1]],
          prisma,
          resource,
        });

        return res.json({ ok: true });
      } catch (e) {
        return res.status(500).json({ error: (e as Error).message });
      }
    })
    .delete(`${apiBasePath}/:model`, async (req, res) => {
      const resource = getResourceFromParams(
        [req.query[paramKey]![0]],
        resources
      );

      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      if (!hasPermission(options?.model?.[resource], Permission.DELETE)) {
        return res.status(403).json({
          error: "You don't have permission to delete this resource",
        });
      }

      let body;

      try {
        body = await getJsonBody(req);
      } catch {
        return res.status(400).json({ error: "Invalid JSON body" });
      }

      try {
        await deleteResource({ body, prisma, resource });

        return res.json({ ok: true });
      } catch (e) {
        return res.status(500).json({ error: (e as Error).message });
      }
    });

  const executeRouteHandler = (req: NextApiRequest, res: NextApiResponse) => {
    return router.run(req, res);
  };

  return { run: executeRouteHandler, router };
};
