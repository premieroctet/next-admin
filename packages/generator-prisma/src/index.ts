#!/usr/bin/env node
import { generatorHandler } from "@prisma/generator-helper";
import fs from "node:fs/promises";
import path from "node:path";
// @ts-expect-error
import { transformDMMF } from "prisma-json-schema-generator/dist/generator/transformDMMF";
import { insertDmmfData } from "./dmmf";
import { getEnvValue } from "./env";
import {
  getNewPrismaClientGenerator,
  updateNextAdminPrismaTypesImport,
} from "./generator";

generatorHandler({
  onManifest: () => {
    return {
      defaultOutput: path.dirname(require.resolve("@premieroctet/next-admin")),
      prettyName: "Next Admin JSON Schema Generator",
    };
  },
  onGenerate: async (options) => {
    const jsonSchema = transformDMMF(options.dmmf, {
      ...options.generator.config,
      includeRequiredFields: true,
    });

    insertDmmfData(options.dmmf, jsonSchema);

    if (options.generator.output) {
      const outputDir = getEnvValue(options.generator.output) as string;

      await fs.mkdir(outputDir, { recursive: true });

      const cjsContent = `module.exports = ${JSON.stringify(jsonSchema, null, 2)}`;

      await fs.writeFile(path.join(outputDir, "schema.cjs"), cjsContent);

      const mjsContent = `export default ${JSON.stringify(jsonSchema, null, 2)}`;

      await fs.writeFile(path.join(outputDir, "schema.mjs"), mjsContent);
    }

    const newPrismaClient = getNewPrismaClientGenerator(
      options.otherGenerators
    );

    if (newPrismaClient) {
      if (!newPrismaClient.output) {
        throw new Error("Prisma Client output is required");
      }
      await updateNextAdminPrismaTypesImport(
        newPrismaClient,
      );
    }
  },
});
