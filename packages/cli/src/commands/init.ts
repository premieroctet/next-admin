import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";
import { Command } from "commander";
import { confirm, input } from "@inquirer/prompts";
import { getPackageManager } from "../utils/packageManager";
import { updatePrismaSchema } from "../utils/prisma";
import { addTailwindCondig } from "../utils/tailwind";
import { getRouterRoot } from "../utils/next";
import {
  writeToTemplate,
} from "../utils/templates";
import {
  NEXTADMIN_OPTIONS_FILENAME,
  NEXTADMIN_CSS_FILENAME,
} from "../utils/constants";

type InitOptions = {
  basePath: string;
  schemaPath: string;
  baseRoutePath?: string;
  baseApiPath?: string;
};

export const initAction = async ({
  basePath,
  schemaPath,
  baseRoutePath,
  baseApiPath,
}: InitOptions) => {
  if (!existsSync(basePath)) {
    chalk.red(`Directory ${basePath} does not exist`);
    process.exit(1);
  }

  if (!existsSync(schemaPath)) {
    chalk.red(`Schema file ${schemaPath} does not exist`);
    process.exit(1);
  }

  chalk.green(`Initializing Next-Admin in ${basePath}`);
  const packageManagerData = getPackageManager(basePath);

  if (!packageManagerData) {
    chalk.red("Could not determine package manager");
    process.exit(1);
  }

  if (!baseRoutePath) {
    baseRoutePath = await input({
      message: "Enter the base route path",
      default: "/admin",
      required: true,
      validate: (input) => {
        if (!input.startsWith("/")) {
          return "Base route path must start with a /";
        }

        return true;
      },
    });
  }

  if (!baseApiPath) {
    baseApiPath = await input({
      message: "Enter the base API route path",
      default: "/api/admin",
      required: true,
      validate: (input) => {
        if (!input.startsWith("/api")) {
          return "Base API route path must start with /api";
        }

        return true;
      },
    });
  }

  const prismaClientPath = await input({
    message: "Enter the path to the Prisma client instance file",
    default: "./prisma",
    required: true,
    validate: (input) => {
      if (!existsSync(path.join(basePath, input))) {
        return "Prisma client instance file does not exist";
      }

      return true;
    },
  });

  const usesTypescript = existsSync(path.join(basePath, "tsconfig.json"));

  const spinner = ora("Installing dependencies").start();

  await execa`${packageManagerData.installCmd} @premieroctet/next-admin`;
  await execa`${packageManagerData.installDevCmd} prisma-json-schema-generator tailwindcss`;

  spinner.text = "Generating JSON schema";

  try {
    await updatePrismaSchema(schemaPath);
  } catch {
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
    const confirmPath = await confirm({
      message: `Next-Admin page is going to be created under ${routerRootPath}. Continue?`,
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

  const pageFolderPath = path.join(
    routerRootPath.path,
    ...baseRoutePath.split("/").filter(Boolean),
    routerRootPath.type === "app" ? "[[...nextadmin]]" : ""
  );
  const apiFolderPath = path.join(
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
      ? path.join(pageFolderPath, `[[...nextadmin]]${pageFileExtension}`)
      : path.join(pageFolderPath, `page.${pageFileExtension}`);
  const apiFilePath =
    routerRootPath.type === "page"
      ? path.join(apiFolderPath, `[[...nextadmin]]${apiFileExtension}`)
      : path.join(apiFolderPath, `route.${apiFileExtension}`);

  const prismaPath = path.join(basePath, prismaClientPath);
  const jsonSchemaPath = path.join(
    basePath,
    schemaPath,
    "json-schema",
    "json-schema.json"
  );

  const pageContent = writeToTemplate(
    routerRootPath.type === "page"
      ? "page_router_page"
      : "app_router_page",
    {
      prismaClientPath: path.relative(pageFilePath, prismaPath),
      jsonSchemaPath: path.relative(pageFilePath, jsonSchemaPath),
      stylesPath: path.relative(
        pageFilePath,
        path.join(basePath, NEXTADMIN_CSS_FILENAME)
      ),
      pageBasePath: baseRoutePath,
      apiBasePath: baseApiPath,
      optionsPath: path.relative(
        pageFilePath,
        path.join(
          basePath,
          NEXTADMIN_OPTIONS_FILENAME
        )
      ),
      isTypescript: usesTypescript
    }
  );

  writeFileSync(pageFilePath, pageContent);

  const apiContent = writeToTemplate(
    routerRootPath.type === "page"
      ? "page_router_api"
      : "app_router_api",
    {
      prismaClientPath: path.relative(apiFilePath, prismaPath),
      jsonSchemaPath: path.relative(apiFilePath, jsonSchemaPath),
      optionsPath: path.relative(
        apiFilePath,
        path.join(
          basePath,
          NEXTADMIN_OPTIONS_FILENAME
        )
      ),
      apiBasePath: baseApiPath,
      isTypescript: usesTypescript
    }
  );

  writeFileSync(apiFilePath, apiContent);

  const optionsContent = writeToTemplate('options', {
    isTypescript: usesTypescript
  })

  writeFileSync(
    path.join(basePath, `${NEXTADMIN_OPTIONS_FILENAME}.${pageFileExtension}`),
    optionsContent
  );

  spinner.succeed(`Next-admin files have been created. Options are located under ${path.join(basePath, `${NEXTADMIN_OPTIONS_FILENAME}.${pageFileExtension}`)}

See the Next-Admin documentation for more information on how to customize the admin panel.
https://next-admin.js.org/docs/api/options
`);
};

export const initCommand = (program: Command) => {
  program
    .command("init")
    .description("Initialize Next-Admin in your Next.js project")
    .option("--cwd <path>", "The Next.js project directory")
    .option(
      "-s, --schema <path>",
      "The directory path where the Prisma schema is located, relative to project root, or cwd if provided",
      "prisma"
    )
    .option(
      "-r, --baseRoutePath <path>",
      "The base route path to access your admin in the browser (e.g: /admin)"
    )
    .option(
      "-a, --baseApiPath <path>",
      "The base route path for the API routes (e.g: /api/admin)"
    )
    .action(async (_, options) => {
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
    });
};
