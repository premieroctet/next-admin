import path from "path";
import { existsSync } from "fs";

export enum PackageManager {
  NPM = "npm",
  YARN = "yarn",
  PNPM = "pnpm",
  BUN = "bun",
}

export const packageManagerLockFiles = {
  [PackageManager.NPM]: "package-lock.json",
  [PackageManager.YARN]: "yarn.lock",
  [PackageManager.PNPM]: "pnpm-lock.yaml",
  [PackageManager.BUN]: "bun.lockb",
};

export const packageManagerInstallCmd = {
  [PackageManager.NPM]: "npm install",
  [PackageManager.YARN]: "yarn add",
  [PackageManager.PNPM]: "pnpm add",
  [PackageManager.BUN]: "bun add",
};

export const packageManagerInstallDevCmd = {
  [PackageManager.NPM]: "npm install --save-dev",
  [PackageManager.YARN]: "yarn add -D",
  [PackageManager.PNPM]: "pnpm add -D",
  [PackageManager.BUN]: "bun add -D",
};

type PackageManagerData = {
  name: PackageManager;
  installCmd: string;
  installDevCmd: string;
};

export const getPackageManager = (
  basePath: string
): PackageManagerData | undefined => {
  const entries = Object.entries(packageManagerLockFiles);

  for (const [name, lockFile] of entries) {
    if (existsSync(path.join(basePath, lockFile))) {
      return {
        name: name as PackageManager,
        installCmd: packageManagerInstallCmd[name as PackageManager],
        installDevCmd: packageManagerInstallDevCmd[name as PackageManager],
      };
    }
  }
};
