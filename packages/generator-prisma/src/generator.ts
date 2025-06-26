import { GeneratorConfig } from "@prisma/generator-helper";
import * as esbuild from "esbuild";
import { glob } from "glob";
import fs from "node:fs";
import path from "node:path";
import * as ts from "typescript";
import { getEnvValue } from "./env";

export const getNewPrismaClientGenerator = (generators: GeneratorConfig[]) => {
  return generators.find((gen) => {
    const providerName = getEnvValue(gen.provider!);
    return providerName === "prisma-client";
  });
};

const buildGeneratedFilesTo = async (
  filesToBuild: string[],
  outDir: string
) => {
  await Promise.all(
    (["cjs", "esm"] as esbuild.Format[]).map(async (format) => {
      const ext = format === "cjs" ? ".js" : ".mjs";

      await esbuild.build({
        entryPoints: filesToBuild,
        bundle: false,
        outdir: outDir,
        format,
        outExtension: {
          ".js": ext,
        },
        platform: "node",
      });

      if (format === "esm") {
        const mjsFiles = glob.sync("**/*.mjs", { cwd: outDir, absolute: true });
        mjsFiles.forEach((file) => {
          let content = fs.readFileSync(file, "utf8");
          // Replace relative imports to use .mjs extension
          content = content.replace(
            /from\s+['"](\.[^'"]*?)(?:\.js)?['"]/g,
            "from '$1.mjs'"
          );
          fs.writeFileSync(file, content, "utf8");
        });
      }
    })
  );
};

const buildGeneratedDtsFiles = async (files: string[], outDir: string) => {
  const options: ts.CompilerOptions = {
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
    outDir,
  };
  const host = ts.createCompilerHost(options);

  host.writeFile = (fileName, contents) => {
    fs.writeFileSync(fileName, contents);
  };

  const program = ts.createProgram(files, options, host);
  program.emit();
};

export const updateNextAdminPrismaTypesImport = async (
  generator: GeneratorConfig
) => {
  const nextAdminPath = path.dirname(
    require.resolve("@premieroctet/next-admin")
  );

  const generatorOutput = getEnvValue(generator.output!) ?? "";

  if (!fs.existsSync(path.resolve(generatorOutput))) {
    throw new Error(
      `Generator output path ${generatorOutput} does not exist, make sure to declare your prisma client BEFORE Next-Admin's one`
    );
  }

  const generatedPrismaInNextAdmin = path.join(
    nextAdminPath,
    "generated",
    "prisma"
  );

  const generatedFiles = glob.sync("**/*.{js,mjs,ts,mts}", {
    cwd: generatorOutput,
    absolute: true,
  });

  await buildGeneratedFilesTo(generatedFiles, generatedPrismaInNextAdmin);

  await buildGeneratedDtsFiles(generatedFiles, generatedPrismaInNextAdmin);

  glob.sync("**/*.{js,mjs,ts}", { cwd: nextAdminPath }).forEach((file) => {
    const filePath = path.join(nextAdminPath, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const isEsm = file.endsWith(".mjs");

    let pathReplacement = path.relative(
      path.dirname(filePath),
      generatedPrismaInNextAdmin
    );

    if (!pathReplacement.startsWith(`.${path.sep}`)) {
      pathReplacement = `.${path.sep}${pathReplacement}`;
    }

    const updatedContent = fileContent.replace(
      /('|")@prisma\/client('|")/g,
      `"${pathReplacement}/client${isEsm ? ".mjs" : ""}"`
    );
    fs.writeFileSync(filePath, updatedContent, "utf8");
  });
};
