import * as esbuild from "esbuild";
import { buildOptions } from "./options";

const build = async () => {
  await esbuild.build({
    ...buildOptions,
  });
};

build();
