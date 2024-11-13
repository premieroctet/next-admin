import { readFileSync, writeFileSync } from "fs";
import { execa } from "execa";

export const updatePrismaSchema = async (schemaPath: string) => {
  const schema = readFileSync(schemaPath, "utf-8");

  const hasJsonSchemaProvider = schema.match(
    /provider\s+=\s+("|')prisma-json-schema-generator("|')/
  );

  if (!hasJsonSchemaProvider) {
    const updatedSchema = schema.replace(
      /(generator client {)/gm,
      `generator nextAdmin {
    provider              = "next-admin-generator-prisma"
  }\n$1`
    );

    writeFileSync(schemaPath, updatedSchema);
  }

  await execa`npx prisma generate --schema ${schemaPath}`;
};
