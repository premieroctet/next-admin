import { NextApiRequest, NextApiResponse } from "next";
import { ModelName } from "@premieroctet/next-admin";
import { exportModelAsCsv } from "@premieroctet/next-admin/dist/csv";
import { prisma } from "../../../../prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { model } = req.query

  if (!prisma[(model as string).toLowerCase() as keyof typeof prisma]) {
    return res.status(404).json({ message: "Model not found" });
  }

  const csv = await exportModelAsCsv(prisma, model as ModelName);

  res.status(200).send(csv)
}
