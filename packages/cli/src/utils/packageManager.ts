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
  [PackageManager.NPM]: "install",
  [PackageManager.YARN]: "add",
  [PackageManager.PNPM]: "add",
  [PackageManager.BUN]: "add",
};

export const packageManagerInstallDevCmd = {
  [PackageManager.NPM]: "install --save-dev",
  [PackageManager.YARN]: "add -D",
  [PackageManager.PNPM]: "add -D",
  [PackageManager.BUN]: "add -D",
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

export const getDataForPackageManager = (
  packageManager: PackageManager
): PackageManagerData => {
  return {
    name: packageManager,
    installCmd: packageManagerInstallCmd[packageManager],
    installDevCmd: packageManagerInstallDevCmd[packageManager],
  };
};
