"use server";
import { ActionParams, ModelName } from "@premieroctet/next-admin";
import {
  deleteResourceItems,
  submitForm,
} from "@premieroctet/next-admin/dist/actions";
import { exportModelAsCsv } from "@premieroctet/next-admin/dist/csv";
import { prisma } from "../prisma";
import { options } from "../options";

export const submitFormAction = async (
  params: ActionParams,
  formData: FormData
) => {
  return submitForm({ ...params, options, prisma }, formData);
};

export const submitEmail = async (
  model: ModelName,
  ids: number[] | string[]
) => {
  console.log("Sending email to " + ids.length + " users");
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export const deleteItem = async (
  model: ModelName,
  ids: string[] | number[]
) => {
  return deleteResourceItems(prisma, model, ids);
};

export const exportCsvAction = async (model: ModelName) => {
  const csvContent = await exportModelAsCsv(prisma, model);

  return csvContent;
};
