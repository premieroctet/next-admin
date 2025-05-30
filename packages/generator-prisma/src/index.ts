#!/usr/bin/env node
import { generatorHandler } from "@prisma/generator-helper";
import { parseEnvValue } from "@prisma/internals";
import path from "path";
import fs from "fs/promises";
// @ts-expect-error
import { transformDMMF } from "prisma-json-schema-generator/dist/generator/transformDMMF";
import { insertDmmfData } from "./dmmf";

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
      const outputDir =
        typeof options.generator.output === "string"
          ? options.generator.output
          : parseEnvValue(options.generator.output);

      await fs.mkdir(outputDir, { recursive: true });

      const cjsContent = `module.exports = ${JSON.stringify(jsonSchema, null, 2)}`;

      await fs.writeFile(path.join(outputDir, "schema.cjs"), cjsContent);

      const mjsContent = `export default ${JSON.stringify(jsonSchema, null, 2)}`;

      await fs.writeFile(path.join(outputDir, "schema.mjs"), mjsContent);
    }
  },
});
