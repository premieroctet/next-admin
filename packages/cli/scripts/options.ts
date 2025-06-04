import type * as esbuild from "esbuild";
import fs from "fs";

const plugin: esbuild.Plugin = {
  name: "cliPlugin",
  setup(build) {
    build.onEnd(() => {
      fs.chmodSync("dist/index.js", "755");

      fs.cpSync("src/templates", "dist/templates", { recursive: true });
    });
  },
};

export const buildOptions: esbuild.BuildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  minify: true,
  plugins: [plugin],
  outfile: "dist/index.js",
  external: ["fs", "path"],
  banner: {
    js: "#!/usr/bin/env node",
  },
};
