import { confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { execa, parseCommandString } from "execa";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import ora from "ora";
import path from "path";
import {
  NEXTADMIN_CSS_FILENAME,
  NEXTADMIN_OPTIONS_FILENAME,
} from "../utils/constants";
import { getAppFilePath, getBabelUsage, getRouterRoot } from "../utils/next";
import {
  getDataForPackageManager,
  getPackageManager,
  PackageManager,
} from "../utils/packageManager";
import { getRelativePath } from "../utils/path";
import { updatePrismaSchema } from "../utils/prisma";
import { addTailwindCondig } from "../utils/tailwind";
import { writeToTemplate } from "../utils/templates";

type InitOptions = {
  basePath: string;
  schemaPath: string;
  baseRoutePath: string;
  baseApiPath: string;
};

export const initAction = async ({
  basePath,
  schemaPath,
  baseRoutePath,
  baseApiPath,
}: InitOptions) => {
  if (!existsSync(basePath)) {
    console.error(chalk.red(`Directory ${basePath} does not exist`));
    process.exit(1);
  }

  if (!existsSync(schemaPath)) {
    console.error(chalk.red(`Schema file ${schemaPath} does not exist`));
    process.exit(1);
  }

  console.info(chalk.green(`Initializing Next-Admin in ${basePath}`));
  let packageManagerData = getPackageManager(basePath);

  if (!packageManagerData) {
    console.log(chalk.red("Could not determine package manager"));

    const packageManager = await select({
      message: "Select your package manager",
      default: PackageManager.NPM,
      choices: [
        { name: "npm", value: PackageManager.NPM },
        { name: "yarn", value: PackageManager.YARN },
        { name: "pnpm", value: PackageManager.PNPM },
        { name: "bun", value: PackageManager.BUN },
      ],
    });

    packageManagerData = getDataForPackageManager(packageManager);
  }

  const usesTypescript = existsSync(path.join(basePath, "tsconfig.json"));

  const prismaClientPath = await input({
    message:
      "Enter the path to the Prisma client instance file. if the path does not exist, its content will be automatically generated.",
    default: "./prisma.ts",
    required: true,
  });

  if (!existsSync(path.join(basePath, prismaClientPath))) {
    const prismaContent = writeToTemplate("prisma_instance", {
      isTypescript: usesTypescript,
    });

    writeFileSync(path.join(basePath, prismaClientPath), prismaContent);
  }

  const spinner = ora("Installing dependencies").start();

  try {
    await execa(
      packageManagerData.name,
      parseCommandString(
        `${packageManagerData.installCmd} @premieroctet/next-admin`
      )
    );
    await execa(
      packageManagerData.name,
      parseCommandString(
        `${packageManagerData.installDevCmd} @premieroctet/next-admin-generator-prisma tailwindcss`
      )
    );
  } catch (e) {
    spinner.fail("Failed to install dependencies");
    process.exit(1);
  }

  spinner.text = "Generating JSON schema";

  try {
    await updatePrismaSchema(schemaPath);
  } catch (e) {
    console.log(e);
    spinner.fail("Failed to generate JSON schema");
    process.exit(1);
  }

  spinner.text = "Creating Tailwind CSS configuration";

  addTailwindCondig(basePath);

  spinner.text = "Creating Next-Admin page";

  let routerRootPath = getRouterRoot(basePath);

  if (!routerRootPath) {
    spinner.fail("Could not determine the root path of the Next.js router");
    process.exit(1);
  } else {
    spinner.stop();
    const confirmPath = await confirm({
      message: `Next-Admin page is going to be created under ${path.join(basePath, routerRootPath.path)}. Continue?`,
      default: true,
    });

    if (!confirmPath) {
      routerRootPath.path = await input({
        message:
          "Enter the path (relative to project root) where the Next-Admin page should be created from the project root. Example: src/pages",
        default: routerRootPath.path,
        required: true,
        validate: (input) => {
          if (
            !(
              input.startsWith("src/pages") ||
              input.startsWith("pages") ||
              input.startsWith("src/app") ||
              input.startsWith("app")
            )
          ) {
            return "Path must be src/pages, pages, src/app or app";
          }

          return true;
        },
      });

      routerRootPath.type = routerRootPath.path.includes("pages")
        ? "page"
        : "app";
    }
  }

  spinner.start();

  const pageFolderPath = path.join(
    basePath,
    routerRootPath.path,
    ...baseRoutePath.split("/").filter(Boolean),
    routerRootPath.type === "app" ? "[[...nextadmin]]" : ""
  );
  const apiFolderPath = path.join(
    basePath,
    routerRootPath.path,
    ...baseApiPath.split("/").filter(Boolean),
    routerRootPath.type === "app" ? "[[...nextadmin]]" : ""
  );

  mkdirSync(pageFolderPath, { recursive: true });
  mkdirSync(apiFolderPath, { recursive: true });

  const pageFileExtension = usesTypescript ? "tsx" : "js";
  const apiFileExtension = usesTypescript ? "ts" : "js";

  const pageFilePath =
    routerRootPath.type === "page"
      ? path.join(pageFolderPath, `[[...nextadmin]].${pageFileExtension}`)
      : path.join(pageFolderPath, `page.${pageFileExtension}`);
  const apiFilePath =
    routerRootPath.type === "page"
      ? path.join(apiFolderPath, `[[...nextadmin]].${apiFileExtension}`)
      : path.join(apiFolderPath, `route.${apiFileExtension}`);

  const prismaPath = path.join(
    basePath,
    prismaClientPath.replace(/\.(ts|tsx|js|jsx)$/, "")
  );

  const pageContent = writeToTemplate(
    routerRootPath.type === "page" ? "page_router_page" : "app_router_page",
    {
      prismaClientPath: getRelativePath(pageFilePath, prismaPath),
      stylesPath: getRelativePath(
        pageFilePath,
        path.join(basePath, NEXTADMIN_CSS_FILENAME)
      ),
      pageBasePath: baseRoutePath,
      apiBasePath: baseApiPath,
      optionsPath: getRelativePath(
        pageFilePath,
        path.join(basePath, NEXTADMIN_OPTIONS_FILENAME)
      ),
      isTypescript: usesTypescript,
    }
  );

  writeFileSync(pageFilePath, pageContent);

  const apiContent = writeToTemplate(
    routerRootPath.type === "page" ? "page_router_api" : "app_router_api",
    {
      prismaClientPath: getRelativePath(apiFilePath, prismaPath),
      optionsPath: getRelativePath(
        apiFilePath,
        path.join(basePath, NEXTADMIN_OPTIONS_FILENAME)
      ),
      apiBasePath: baseApiPath,
      isTypescript: usesTypescript,
    }
  );

  writeFileSync(apiFilePath, apiContent);

  const optionsContent = writeToTemplate("options", {
    isTypescript: usesTypescript,
  });

  writeFileSync(
    path.join(basePath, `${NEXTADMIN_OPTIONS_FILENAME}.${pageFileExtension}`),
    optionsContent
  );

  let extraInstructions = "";

  if (routerRootPath.type === "page") {
    const appFilePath = getAppFilePath(basePath);

    if (appFilePath) {
      let appFileContent = readFileSync(appFilePath, "utf-8");
      appFileContent = `import "${getRelativePath(
        appFilePath,
        path.join(basePath, NEXTADMIN_CSS_FILENAME)
      )}"\n${appFileContent}`;
      writeFileSync(appFilePath, appFileContent);
    }

    const usesBabel = getBabelUsage(basePath);

    let superjsonInstructions = `Add the following to your babel configuration file:

{
  "presets": ["next/babel"],
  "plugins": ["superjson-next"]
}
`;
    if (!usesBabel) {
      superjsonInstructions = `Add the following to your Next.js configuration file:

experimental: {
  swcPlugins: [
    [
      "next-superjson-plugin",
      {
        excluded: [],
      },
    ],
  ],
},
`;
    }

    extraInstructions = `You will need to do the following manually:
- ${usesBabel ? `${packageManagerData.name} ${packageManagerData.installDevCmd} babel-plugin-superjson-next superjson@^1` : `${packageManagerData.name} ${packageManagerData.installDevCmd} next-superjson-plugin superjson`}
- ${superjsonInstructions}
- Add "@premieroctet/next-admin" to your transpilePackages array in the Next.js configuration file
`;
  }

  if (routerRootPath.type === "app") {
    extraInstructions = `You will need to do the following manually:
- Add the suppressHydrationWarning prop to the closest <html> tag for the admin page
`;
  }

  spinner.succeed(`Next-admin files have been created. Options are located under ${path.join(basePath, `${NEXTADMIN_OPTIONS_FILENAME}.${pageFileExtension}`)}

${extraInstructions}
See the Next-Admin documentation for more information on how to customize the admin panel.
https://next-admin.js.org/docs/api/options
`);
};

export const initCommand = (program: Command) => {
  program
    .command("init")
    .description("Initialize Next-Admin in your Next.js project")
    .option(
      "--cwd <path>",
      "The Next.js project directory",
      path.relative(process.cwd(), process.cwd()) || "."
    )
    .option(
      "-s, --schema <path>",
      "The directory path where the Prisma schema is located, relative to the current directory, or cwd if provided",
      "prisma/schema.prisma"
    )
    .option(
      "-r, --baseRoutePath <path>",
      "The base route path to access your admin in the browser (e.g: /admin)",
      "/admin"
    )
    .option(
      "-a, --baseApiPath <path>",
      "The base route path for the API routes (e.g: /api/admin)",
      "/api/admin"
    )
    .action(async (options) => {
      try {
        const basePath = path.resolve(
          path.join(process.cwd(), options.cwd ?? "")
        );
        const schemaPath = path.resolve(
          path.join(basePath, options.schema ?? "")
        );

        await initAction({
          basePath,
          schemaPath,
          baseRoutePath: options.baseRoutePath,
          baseApiPath: options.baseApiPath,
        });
      } catch (e) {
        console.log(e);
      }
    });
};
