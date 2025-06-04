import * as esbuild from "esbuild";
import { buildOptions } from "./options";

const dev = async () => {
  const ctx = await esbuild.context({
    ...buildOptions,
  });

  await ctx.watch();
};

dev();
