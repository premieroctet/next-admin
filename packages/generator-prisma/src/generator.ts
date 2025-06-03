import { GeneratorConfig } from "@prisma/generator-helper";
import { glob } from "glob";
import fs from "node:fs";
import path from "node:path";
import { getEnvValue } from "./env";

export const getNewPrismaClientGenerator = (generators: GeneratorConfig[]) => {
  return generators.find((gen) => {
    const providerName = getEnvValue(gen.provider!);
    return providerName === "prisma-client";
  });
};

export const updateNextAdminPrismaTypesImport = (
  generator: GeneratorConfig,
  pathReplacement?: string
) => {
  const nextAdminPath = path.dirname(
    require.resolve("@premieroctet/next-admin")
  );

  const generatorOutput = getEnvValue(generator.output!) ?? "";

  glob.sync("**/*.{js,mjs,ts}", { cwd: nextAdminPath }).forEach((file) => {
    const filePath = path.join(nextAdminPath, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const updatedContent = fileContent.replace(
      /('|")@prisma\/client('|")/g,
      `"${pathReplacement ?? path.relative(path.dirname(filePath), generatorOutput)}"`
    );
    fs.writeFileSync(filePath, updatedContent, "utf8");
  });
};
