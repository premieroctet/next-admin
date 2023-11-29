"use server";
import { ActionParams } from "@premieroctet/next-admin";
import { submitForm } from "@premieroctet/next-admin/dist/actions";
import { prisma } from "../prisma";
import { options } from "../options";

export const submitFormAction = async (
  params: ActionParams,
  formData: FormData
) => {
  return submitForm({ ...params, options, prisma }, formData);
};
