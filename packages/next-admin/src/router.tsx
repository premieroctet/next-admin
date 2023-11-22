import { PrismaClient } from "@prisma/client";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { createRouter } from "next-connect";

import {
  EditFieldsOptions,
  EditOptions,
  NextAdminOptions,
  Select,
} from "./types";
import { getMappedDataList } from "./utils/prisma";
import {
  fillRelationInSchema,
  formatSearchFields,
  formattedFormData,
  getFormDataValues,
  getPrismaModelForResource,
  getResourceFromUrl,
  getResourceIdFromUrl,
  getResources,
  parseFormData,
  transformData,
  transformSchema,
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
      .get(async (req, res) => {
        const resource = getResourceFromUrl(req.url!, resources);
        const requestOptions = formatSearchFields(req.url!);

        // Dashboard
        if (!resource) {
          return { props: defaultProps };
        }
        const model = getPrismaModelForResource(resource);

        let selectedFields = model?.fields.reduce(
          (acc, field) => {
            // @ts-expect-error
            acc[field.name] = true;
            return acc;
          },
          { id: true } as Select<typeof resource>
        );

        schema = await fillRelationInSchema(
          schema,
          prisma,
          resource,
          requestOptions,
          options
        );
        const edit = options?.model?.[resource]?.edit as EditOptions<
          typeof resource
        >;
        const editDisplayedKeys = edit && edit.display;
        const editSelect = editDisplayedKeys?.reduce(
          (acc, column) => {
            acc[column] = true;
            return acc;
          },
          { id: true } as Select<typeof resource>
        );
        selectedFields = editSelect ?? selectedFields;

        // Edit
        const resourceId = getResourceIdFromUrl(req.url!, resource);

        const dmmfSchema = getPrismaModelForResource(resource);
        if (resourceId !== undefined) {
          // @ts-expect-error
          let data = await prisma[resource].findUniqueOrThrow({
            where: { id: resourceId },
            select: selectedFields,
          });
          schema = transformSchema(schema, resource, edit);
          data = transformData(data, resource, edit);
          return {
            props: {
              ...defaultProps,
              resource,
              data,
              schema,
              dmmfSchema: dmmfSchema?.fields,
            },
          };
        }
        // New
        if (req.url!.includes("/new")) {
          return {
            props: {
              ...defaultProps,
              resource,
              schema,
              dmmfSchema: dmmfSchema?.fields,
            },
          };
        }

        // List
        const searchParams = new URLSearchParams(req.url!.split("?")[1]);
        const { data, total, error } = await getMappedDataList(
          prisma,
          resource,
          options,
          searchParams
        );
        return {
          props: {
            ...defaultProps,
            resource,
            data,
            total,
            error,
            schema,
            dmmfSchema,
          },
        };
      })
      .post(async (req, res) => {
        const resource = getResourceFromUrl(req.url!, resources);
        const requestOptions = formatSearchFields(req.url!);

        if (!resource) {
          return { notFound: true };
        }
        const resourceId = getResourceIdFromUrl(req.url!, resource);
        const model = getPrismaModelForResource(resource);

        let selectedFields = model?.fields.reduce(
          (acc, field) => {
            // @ts-expect-error
            acc[field.name] = true;
            return acc;
          },
          { id: true } as Select<typeof resource>
        );

        schema = await fillRelationInSchema(
          schema,
          prisma,
          resource,
          requestOptions,
          options
        );
        const edit = options?.model?.[resource]?.edit as EditOptions<
          typeof resource
        >;
        const editDisplayedKeys = edit && edit.display;
        const editSelect = editDisplayedKeys?.reduce(
          (acc, column) => {
            acc[column] = true;
            return acc;
          },
          { id: true } as Select<typeof resource>
        );
        selectedFields = editSelect ?? selectedFields;

        schema = await fillRelationInSchema(
          schema,
          prisma,
          resource,
          requestOptions,
          options
        );
        schema = transformSchema(schema, resource, edit);
        const {
          __admin_action: action,
          id,
          ...formData
        } = await getFormDataValues(req);

        const dmmfSchema = getPrismaModelForResource(resource);

        const parsedFormData = parseFormData(formData, dmmfSchema?.fields!);

        try {
          // Delete redirect, display the list (this is needed because next keeps the HTTP method on redirects)
          if (resourceId === undefined && action === "delete") {
            const searchParams = new URLSearchParams(req.url!.split("?")[1]);
            const { data, total } = await getMappedDataList(
              prisma,
              resource,
              options,
              searchParams
            );

            return {
              props: {
                ...defaultProps,
                resource,
                message: {
                  type: "success",
                  content: "Deleted successfully",
                },
                total,
                data,
              },
            };
          }

          // Delete
          if (resourceId !== undefined && action === "delete") {
            // @ts-expect-error
            await prisma[resource].delete({
              where: {
                id: resourceId,
              },
            });

            return {
              redirect: {
                destination: `${options.basePath}/${resource}`,
                permanent: false,
              },
            };
          }

          // Update
          let data;

          const fields = options.model?.[resource]?.edit
            ?.fields as EditFieldsOptions<typeof resource>;

          // Validate
          validate(parsedFormData, fields);

          if (resourceId !== undefined) {
            // @ts-expect-error
            data = await prisma[resource].update({
              where: {
                id: resourceId,
              },
              data: await formattedFormData(
                formData,
                dmmfSchema?.fields!,
                schema,
                resource,
                false,
                fields
              ),
              select: selectedFields,
            });

            data = transformData(data, resource, edit);
            const fromCreate = req.headers.referer
              ?.split("?")[0]
              .endsWith(`${options.basePath}/${resource}/new`);
            const message = fromCreate
              ? {
                  type: "success",
                  content: "Created successfully",
                }
              : {
                  type: "success",
                  content: "Updated successfully",
                };

            return {
              props: {
                ...defaultProps,
                resource,
                data,
                message,
                schema,
                dmmfSchema: dmmfSchema?.fields,
              },
            };
          }

          // Create
          // @ts-expect-error
          data = await prisma[resource].create({
            data: await formattedFormData(
              formData,
              dmmfSchema?.fields!,
              schema,
              resource,
              true,
              fields
            ),
            select: selectedFields,
          });

          data = transformData(data, resource, edit);
          return {
            redirect: {
              destination: `${options.basePath}/${resource}/${data.id}`,
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

            if (resourceId !== undefined) {
              // @ts-expect-error
              data = await prisma[resource].findUnique({
                where: { id: resourceId },
                select: selectedFields,
              });
              data = transformData(data, resource, edit);
            }

            // TODO This could be improved by merging form values but it's breaking stuff
            if (error.name === "ValidationError") {
              error.errors.map((error: any) => {
                // @ts-expect-error
                data[error.property] = formData[error.property];
              });
            }

            return {
              props: {
                ...defaultProps,
                resource,
                schema,
                dmmfSchema: dmmfSchema?.fields,
                error: error.message,
                validation: error.errors,
                data,
              },
            };
          }

          throw error;
        }
      })
  );
};
