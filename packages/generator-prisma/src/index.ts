#!/usr/bin/env node
import { generatorHandler } from "@prisma/generator-helper";
import { parseEnvValue } from "@prisma/internals";
import path from "path";
import fs from "fs/promises";
// @ts-expect-error
import { transformDMMF } from "prisma-json-schema-generator/dist/generator/transformDMMF";
import { insertDmmfData } from "./dmmf";
import { convertJsonSchemaToOpenApi } from "./openapi";
import { dump as yamlDump } from "js-yaml";

generatorHandler({
  onManifest: () => {
    return {
      defaultOutput: path.resolve(
        path.join(
          require.resolve("@premieroctet/next-admin"),
          "..",
          "..",
          "node_modules",
          ".next-admin"
        )
      ),
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
      
      // Write JSON Schema
      await fs.writeFile(
        path.join(outputDir, "schema.json"),
        JSON.stringify(jsonSchema, null, 2)
      );
      
      // Generate OpenAPI document from JSON Schema
      const openApiDocument = convertJsonSchemaToOpenApi(jsonSchema);
      
      // Write OpenAPI document as JSON
      await fs.writeFile(
        path.join(outputDir, "openapi.json"),
        JSON.stringify(openApiDocument, null, 2)
      );
      
      // Write OpenAPI document as YAML
      await fs.writeFile(
        path.join(outputDir, "openapi.yaml"),
        yamlDump(openApiDocument, { noRefs: true })
      );
    }
  },
});
