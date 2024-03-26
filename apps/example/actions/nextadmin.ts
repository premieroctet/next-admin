"use server";
import { ActionParams, ModelName } from "@premieroctet/next-admin";
import {
  deleteResourceItems,
  submitForm,
} from "@premieroctet/next-admin/dist/actions";
import { prisma } from "../prisma";
import { options } from "../options";
import { setTimeout } from "timers/promises";

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
  await setTimeout(1000);
};

export const deleteItem = async (
  model: ModelName,
  ids: string[] | number[]
) => {
  return deleteResourceItems(prisma, model, ids);
};
