import { PrismaClient } from "@prisma/client";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { createRouter } from "next-connect";

import { EditFieldsOptions, NextAdminOptions } from "./types";
import { getPropsFromParams } from "./utils/props";
import {
  formatSearchFields,
  formattedFormData,
  getFormDataValues,
  getParamsFromUrl,
  getResourceFromParams,
  getResourceIdFromParam,
  getResources,
  parseFormData,
  getPrismaModelForResource,
  getModelIdProperty,
} from "./utils/server";
import { validate } from "./utils/validator";

// Router
export const nextAdminRouter = async (
  prisma: PrismaClient,
  schema: any,
  options: NextAdminOptions
) => {
  const resources = getResources(options);
  const defaultProps = { resources, basePath: options.basePath };

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
            props: { ...defaultProps, error: e.message },
          };
        }
      })
      .get(async (req) => {
        const params = getParamsFromUrl(req.url!, options.basePath);
        const requestOptions = formatSearchFields(req.url!);
        const locale = req.headers["accept-language"]?.split(",")[0];

        const props = await getPropsFromParams({
          options,
          prisma,
          schema,
          searchParams: requestOptions,
          params,
          isAppDir: false,
          locale,
        });

        return { props };
      })
      .post(async (req, res) => {
        const params = getParamsFromUrl(req.url!, options.basePath);

        const resource = getResourceFromParams(params, resources);
        const requestOptions = formatSearchFields(req.url!);

        if (!resource) {
          return { notFound: true };
        }

        const resourceId = getResourceIdFromParam(params[1], resource);

        const getProps = () =>
          getPropsFromParams({
            options,
            prisma,
            schema,
            searchParams: requestOptions,
            params,
            isAppDir: false,
          });

        const {
          __admin_action: action,
          id,
          ...formData
        } = await getFormDataValues(req);

        const dmmfSchema = getPrismaModelForResource(resource);

        const parsedFormData = parseFormData(formData, dmmfSchema?.fields!);

        const modelIdProperty = getModelIdProperty(resource);

        try {
          // Delete redirect, display the list (this is needed because next keeps the HTTP method on redirects)
          if (!resourceId && action === "delete") {
            return {
              props: {
                ...(await getProps()),
                resource,
                message: {
                  type: "success",
                  content: "Deleted successfully",
                },
              },
            };
          }

          // Delete
          if (resourceId !== undefined && action === "delete") {
            // @ts-expect-error
            await prisma[resource].delete({
              where: {
                [modelIdProperty]: resourceId,
              },
            });

            return {
              redirect: {
                destination: `${options.basePath}/${resource.toLowerCase()}`,
                permanent: false,
              },
            };
          }

          const fields = options.model?.[resource]?.edit
            ?.fields as EditFieldsOptions<typeof resource>;

          // Validate
          validate(parsedFormData, fields);

          if (resourceId !== undefined) {
            // @ts-expect-error
            await prisma[resource].update({
              where: {
                [modelIdProperty]: resourceId,
              },
              data: await formattedFormData(
                formData,
                dmmfSchema?.fields!,
                schema,
                resource,
                false,
                fields
              ),
            });

            const message = {
              type: "success",
              content: "Updated successfully",
            };

            return {
              props: {
                ...(await getProps()),
                message,
              },
            };
          }

          // Create
          // @ts-expect-error
          const createdData = await prisma[resource].create({
            data: await formattedFormData(
              formData,
              dmmfSchema?.fields!,
              schema,
              resource,
              true,
              fields
            ),
          });

          return {
            redirect: {
              destination: `${options.basePath}/${resource.toLowerCase()}/${
                createdData[modelIdProperty]
              }?message=${JSON.stringify({
                type: "success",
                content: "Created successfully",
              })}`,
              permanent: false,
            },
          };
        } catch (error: any) {
          if (
            error.constructor.name === PrismaClientValidationError.name ||
            error.constructor.name === PrismaClientKnownRequestError.name ||
            error.name === "ValidationError"
          ) {
            let data = parsedFormData;

            // TODO This could be improved by merging form values but it's breaking stuff
            if (error.name === "ValidationError") {
              error.errors.map((error: any) => {
                // @ts-expect-error
                data[error.property] = formData[error.property];
              });
            }

            return {
              props: {
                ...(await getProps()),
                error: error.message,
                validation: error.errors,
              },
            };
          }

          throw error;
        }
      })
  );
};
