import { GeneratorConfig } from "@prisma/generator-helper";
import path from "node:path";
import fs from "node:fs";
import { parseEnvValue } from "@prisma/internals";
import { glob } from "glob";

export const getNewPrismaClientGenerator = (generators: GeneratorConfig[]) => {
  return generators.find((gen) => {
    const providerName =
      typeof gen.provider === "string"
        ? gen.provider
        : parseEnvValue(gen.provider!);
    return providerName === "prisma-client";
  });
};

export const updateNextAdminPrismaTypesImport = (
  generator: GeneratorConfig
) => {
  const nextAdminPath = path.dirname(
    require.resolve("@premieroctet/next-admin")
  );

  const generatorOutput =
    typeof generator.output === "string"
      ? generator.output
      : parseEnvValue(generator.output!);

  glob.sync("**/*.{js,mjs,ts}", { cwd: nextAdminPath }).forEach((file) => {
    const fileContent = fs.readFileSync(path.join(nextAdminPath, file), "utf8");
    console.log(
      "relative path:",
      path.relative(nextAdminPath, generatorOutput)
    );
    const updatedContent = fileContent.replace(
      "@prisma/client",
      path.relative(nextAdminPath, generatorOutput)
    );
    fs.writeFileSync(path.join(nextAdminPath, file), updatedContent, "utf8");
  });
};
