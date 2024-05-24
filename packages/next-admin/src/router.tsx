import { PrismaClient } from "@prisma/client";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { createRouter } from "next-connect";

import { EditFieldsOptions, NextAdminOptions, Permission } from "./types";
import { optionsFromResource } from "./utils/prisma";
import { getPropsFromParams } from "./utils/props";
import {
  formatSearchFields,
  formattedFormData,
  getBody,
  getFormDataValues,
  getModelIdProperty,
  getParamsFromUrl,
  getPrismaModelForResource,
  getResourceFromParams,
  getResourceIdFromParam,
  getResources,
  parseFormData,
} from "./utils/server";
import { slugify, uncapitalize } from "./utils/tools";
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
      .get(async (req, res) => {
        const params = getParamsFromUrl(req.url!, options.basePath);

        const requestOptions = formatSearchFields(req.url!);

        const props = await getPropsFromParams({
          options,
          prisma,
          schema,
          searchParams: requestOptions,
          params,
          isAppDir: false,
        });

        return { props };
      })
      .post(`${options.basePath}/api/options`, async (req, res) => {
        const body = await getBody(req);
        const { originModel, property, model, query, page, perPage } =
          JSON.parse(body) as any;

        const data = await optionsFromResource({
          prisma,
          originResource: originModel,
          property: property,
          resource: model,
          options,
          context: {},
          searchParams: new URLSearchParams({
            search: query,
            page: page.toString(),
            itemsPerPage: perPage.toString(),
          }),
          appDir: false,
        });

        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(data));
        res.end();
      })
      .post(async (req, res) => {
        const params = getParamsFromUrl(req.url!, options.basePath);
        const message = req.url?.split("?message=")[1];

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
          __admin_redirect: redirect,
          id,
          ...formData
        } = await getFormDataValues(req);

        const dmmfSchema = getPrismaModelForResource(resource);

        const parsedFormData = parseFormData(formData, dmmfSchema?.fields!);

        const modelIdProperty = getModelIdProperty(resource);

        try {
          // Delete redirect, display the list (this is needed because next keeps the HTTP method on redirects)
          if (
            !resourceId &&
            params[1] !== "new" &&
            (action === "delete" || redirect)
          ) {
            if (message) {
              return {
                props: {
                  ...(await getProps()),
                  resource,
                  message: JSON.parse(decodeURIComponent(message)),
                },
              };
            }

            return {
              props: {
                ...(await getProps()),
                resource,
              },
            };
          }

          // Delete
          if (resourceId !== undefined && action === "delete") {
            if (
              options?.model?.[resource]?.permissions &&
              !options?.model?.[resource]?.permissions?.includes(
                Permission.DELETE
              )
            ) {
              res.statusCode = 403;
              return {
                props: {
                  ...(await getProps()),
                  error: "Unable to delete items of this model",
                },
              };
            }

            // @ts-expect-error
            await prisma[resource].delete({
              where: {
                [modelIdProperty]: resourceId,
              },
            });
            const message = {
              type: "success",
              content: "Deleted successfully",
            };
            return {
              redirect: {
                destination: `${options.basePath}/${slugify(
                  resource
                )}?message=${JSON.stringify(message)}`,
                permanent: false,
              },
            };
          }

          const fields = options.model?.[resource]?.edit
            ?.fields as EditFieldsOptions<typeof resource>;

          // Validate
          validate(parsedFormData, fields);

          const { formattedData, complementaryFormattedData, errors } =
            await formattedFormData(
              formData,
              dmmfSchema?.fields!,
              schema,
              resource,
              resourceId,
              fields
            );

          if (errors.length) {
            return {
              props: {
                ...(await getProps()),
                error:
                  options.model?.[resource]?.edit?.submissionErrorMessage ??
                  "Submission error",
                validation: errors.map((error) => ({
                  property: error.field,
                  message: error.message,
                })),
              },
            };
          }

          if (resourceId !== undefined) {
            if (
              options?.model?.[resource]?.permissions &&
              !options?.model?.[resource]?.permissions?.includes(
                Permission.EDIT
              )
            ) {
              res.statusCode = 403;
              return {
                props: {
                  ...(await getProps()),
                  error: "Unable to update items of this model",
                },
              };
            }

            // @ts-expect-error
            await prisma[resource].update({
              where: {
                [modelIdProperty]: resourceId,
              },
              data: formattedData,
            });

            const message = {
              type: "success",
              content: "Updated successfully",
            };

            if (redirect) {
              return {
                redirect: {
                  destination: `${options.basePath}/${slugify(
                    resource
                  )}?message=${JSON.stringify(message)}`,
                  permanent: false,
                },
              };
            } else {
              return {
                props: {
                  ...(await getProps()),
                  message,
                },
              };
            }
          }

          // Create
          if (
            options?.model?.[resource]?.permissions &&
            options?.model?.[resource]?.permissions?.includes(Permission.CREATE)
          ) {
            res.statusCode = 403;
            return {
              props: {
                ...(await getProps()),
                error: "Unable to create items of this model",
              },
            };
          }

          // @ts-expect-error
          const createdData = await prisma[resource].create({
            data: formattedData,
          });

          // @ts-expect-error
          await prisma[resource].update({
            where: {
              [modelIdProperty]: createdData[modelIdProperty],
            },
            data: complementaryFormattedData,
          });

          const pathname = redirect
            ? `${options.basePath}/${slugify(resource)}`
            : `${options.basePath}/${slugify(resource)}/${
                createdData[modelIdProperty]
              }`;
          return {
            redirect: {
              destination: `${pathname}?message=${JSON.stringify({
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
      .delete(async (req, res) => {
        const params = getParamsFromUrl(req.url!, options.basePath);
        const resource = getResourceFromParams(params, resources);

        if (!resource) {
          return { notFound: true };
        }

        const body = await getBody(req);
        const bodyJson = JSON.parse(body) as string[] | number[];

        const modelIdProperty = getModelIdProperty(resource);

        // @ts-expect-error
        await prisma[uncapitalize(resource)].deleteMany({
          where: {
            [modelIdProperty]: {
              in: bodyJson,
            },
          },
        });

        return {
          props: {
            ...(await getPropsFromParams({
              searchParams: formatSearchFields(req.url!),
              options,
              prisma,
              schema,
              params,
              isAppDir: false,
            })),
            resource,
            message: {
              type: "success",
              content: "Deleted successfully",
            },
          },
        };
      })
  );
};
