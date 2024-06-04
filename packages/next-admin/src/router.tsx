import { PrismaClient } from "@prisma/client";
import { createRouter } from "next-connect";

import { NextAdminOptions } from "./types";
import {
  formatSearchFields,
  getParamsFromUrl,
  getResources,
} from "./utils/server";

// Router
export const nextAdminRouter = async (
  prisma: PrismaClient,
  schema: any,
  options: NextAdminOptions
) => {
  const resources = getResources(options);
  // const defaultProps = { resources, basePath: options.basePath };

  return (
    createRouter()
      // Error handling middleware
      .use(async (req, res, next) => {
        try {
          return await next();
        } catch (e: any) {
          if (process.env.NODE_ENV === "development") {
            throw e;
          }

          return {
            props: {},
          };
        }
      })
      .get(async (req, res) => {
        // const params = getParamsFromUrl(req.url!, options.basePath);

        // const requestOptions = formatSearchFields(req.url!);

        // const props = await getPropsFromParams({
        //   options,
        //   prisma,
        //   schema,
        //   searchParams: requestOptions,
        //   params,
        // });

        return {  };
      })
  );
};
