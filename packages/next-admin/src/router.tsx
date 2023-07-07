import { PrismaClient } from "@prisma/client";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/data-proxy";
import { createRouter } from "next-connect";

import {
  fillRelationInSchema,
  findRelationInData,
  flatRelationInData,
  formatSearchFields,
  formattedFormData,
  getBody,
  getPrismaModelyForRessource,
  getRessourceFromUrl,
  getRessourceIdFromUrl,
  removeHiddenProperties,
  ressources,
} from "./utils/server";
import {
  NextAdminOptions,
  FormData,
  Body,
  Select,
  EditFieldsOptions,
} from "./types";
import { preparePrismaListRequest } from "./utils/prisma";
import { ressourceToUrl } from "./utils/tools";
import { ADMIN_BASE_PATH } from "./config";

// Router
export const nextAdminRouter = async (
  prisma: PrismaClient,
  schema: any,
  options?: NextAdminOptions
) =>
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
          props: { ressources, error: e.message },
        };
      }
    })
    .get(async (req, res) => {
      const ressource = getRessourceFromUrl(req.url!);
      const requestOptions = formatSearchFields(req.url!);

      // Dashboard
      if (!ressource) {
        return { props: { ressources } };
      }
      const model = getPrismaModelyForRessource(ressource);

      let selectedFields = model?.fields.reduce((acc, field) => {
        // @ts-expect-error
        acc[field.name] = true;
        return acc;
      }, {} as Select<typeof ressource>);

      schema = await fillRelationInSchema(
        schema,
        prisma,
        ressource,
        requestOptions,
        options
      );
      const edit = options?.model?.[ressource]?.edit
        ?.fields as EditFieldsOptions<typeof ressource>;
      const editKeys =
        edit &&
        (Object.keys(edit) as Array<keyof EditFieldsOptions<typeof ressource>>);
      const editSelect = editKeys?.reduce((acc, column) => {
        if (edit[column]?.display) acc[column] = true;
        return acc;
      }, {} as Select<typeof ressource>);
      selectedFields = editSelect ?? selectedFields;

      // Edit
      const ressourceId = getRessourceIdFromUrl(req.url!, ressource);
      
      const dmmfSchema = getPrismaModelyForRessource(ressource);
      if (ressourceId !== undefined) {
        // @ts-expect-error
        let data = await prisma[ressource].findUniqueOrThrow({
          where: { id: ressourceId },
          select: selectedFields,
        });
        schema = removeHiddenProperties(schema, edit, ressource);
        data = flatRelationInData(data, ressource);
        return {
          props: {
            ressources,
            ressource,
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
            ressources,
            ressource,
            schema,
            dmmfSchema: dmmfSchema?.fields,
          },
        };
      }

      // List
      const searchParams = new URLSearchParams(req.url!.split("?")[1]);
      const prismaListRequest = preparePrismaListRequest(
        ressource,
        searchParams,
        options
      );
      let data: any[] = [];
      let total: number;
      let error = null;

      try {
        // @ts-expect-error
        data = await prisma[ressource].findMany(prismaListRequest);
        // @ts-expect-error
        total = await prisma[ressource].count({
          where: prismaListRequest.where,
        });
      } catch (e: any) {
        const { skip, take, orderBy } = prismaListRequest;
        // @ts-expect-error
        data = await prisma[ressource].findMany({
          skip,
          take,
          orderBy,
        });
        // @ts-expect-error
        total = await prisma[ressource].count();
        error = e.message ? e.message : e;
        console.error(e);
      }
      data = await findRelationInData(data, dmmfSchema?.fields);

      return {
        props: {
          ressources,
          ressource,
          data,
          total,
          error,
          schema,
          dmmfSchema,
        },
      };
    })
    .post(async (req, res) => {
      const ressource = getRessourceFromUrl(req.url!);
      const requestOptions = formatSearchFields(req.url!);

      if (!ressource) {
        return { notFound: true };
      }
      const ressourceId = getRessourceIdFromUrl(req.url!, ressource);
      const model = getPrismaModelyForRessource(ressource);

      let selectedFields = model?.fields.reduce((acc, field) => {
        // @ts-expect-error
        acc[field.name] = true;
        return acc;
      }, {} as Select<typeof ressource>);

      schema = await fillRelationInSchema(
        schema,
        prisma,
        ressource,
        requestOptions,
        options
      );
      const edit = options?.model?.[ressource]?.edit
        ?.fields as EditFieldsOptions<typeof ressource>;
      const editKeys =
        edit &&
        (Object.keys(edit) as Array<keyof EditFieldsOptions<typeof ressource>>);
      const editSelect = editKeys?.reduce((acc, column) => {
        if (edit[column]?.display) acc[column] = true;
        return acc;
      }, {} as Select<typeof ressource>);
      selectedFields = editSelect ?? selectedFields;

      schema = await fillRelationInSchema(
        schema,
        prisma,
        ressource,
        requestOptions,
        options
      );
      schema = removeHiddenProperties(schema, edit, ressource);
      await getBody(req, res);
      // @ts-expect-error
      const { id, ...formData } = req.body as Body<FormData<typeof ressource>>;
      const dmmfSchema = getPrismaModelyForRessource(ressource);
      try {
        // Delete redirect, display the list (this is needed because next keeps the HTTP method on redirects)
        if (ressourceId === undefined && formData.action === "delete") {
          const searchParams = new URLSearchParams(req.url!.split("?")[1]);
          const prismaListRequest = preparePrismaListRequest(
            ressource,
            searchParams,
            options
          );
          // @ts-expect-error
          let data = await prisma[ressource].findMany(prismaListRequest);
          data = await findRelationInData(data, dmmfSchema?.fields);
          // @ts-expect-error
          const total = await prisma[ressource].count();

          return {
            props: {
              ressources,
              ressource,
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
        if (ressourceId !== undefined && formData.action === "delete") {
          // @ts-expect-error
          await prisma[ressource].delete({
            where: {
              id: ressourceId,
            },
          });

          return {
            redirect: {
              destination: `${ADMIN_BASE_PATH}/${ressourceToUrl(ressource)}`,
              permanent: false,
            },
          };
        }

        // Update
        let data;

        if (ressourceId !== undefined) {
          // @ts-expect-error
          data = await prisma[ressource].update({
            where: {
              id: ressourceId,
            },
            data: formattedFormData(
              formData,
              dmmfSchema?.fields!,
              schema,
              ressource,
              false
            ),
            select: selectedFields,
          });

          data = flatRelationInData(data, ressource);
          const fromCreate = req.headers.referer
            ?.split("?")[0]
            .endsWith(`${ADMIN_BASE_PATH}/${ressourceToUrl(ressource)}/new`);
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
              ressources,
              ressource,
              data,
              message,
              schema,
              dmmfSchema: dmmfSchema?.fields,
            },
          };
        }

        // Create
        // @ts-expect-error
        data = await prisma[ressource].create({
          data: formattedFormData(
            formData,
            dmmfSchema?.fields!,
            schema,
            ressource,
            true
          ),
          select: selectedFields,
        });

        data = flatRelationInData(data, ressource);
        return {
          redirect: {
            destination: `${ADMIN_BASE_PATH}/${ressourceToUrl(ressource)}/${data.id}`,
            permanent: false,
          },
        };
      } catch (error: any) {
        if (
          error.constructor.name === PrismaClientValidationError.name ||
          error.constructor.name === PrismaClientKnownRequestError.name
        ) {
          let data;
          if (ressourceId !== undefined) {
            // @ts-expect-error
            data = await prisma[ressource].findUnique({
              where: { id: ressourceId },
              select: selectedFields,
            });
            data = flatRelationInData(data, ressource);
            return {
              props: {
                ressources,
                ressource,
                data,
                schema,
                dmmfSchema: dmmfSchema?.fields,
                error: error.message,
              },
            };
          }

          return {
            props: {
              ressources,
              ressource,
              schema,
              dmmfSchema: dmmfSchema?.fields,
              error: error.message,
              data: formData,
            },
          };
        }
        throw error;
      }
    });
