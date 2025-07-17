import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

interface Transformation {
  pattern: RegExp;
  type: "replace" | "insertAfter";
  content: string;
}

const transformations: Transformation[] = [
  {
    pattern: /const \{ readFile \} = await dynamicRequireFn/g,
    type: "insertAfter",
    content: "const { join } = await dynamicRequireFn('node:path')",
  },
  {
    pattern: /const wasmModulePath = _require\.resolve/g,
    type: "replace",
    content:
      "const wasmModulePath = _require.resolve(join(process.cwd(), 'node_modules/@prisma/client/runtime/query_compiler_bg.postgresql.wasm'))",
  },
];

const filePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../generated/prisma/internal/class.ts"
);

function patchFile() {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  let result: string[] = [];

  for (const line of lines) {
    let matched = false;

    for (const transformation of transformations) {
      if (transformation.pattern.test(line.trim())) {
        if (transformation.type === "replace") {
          result.push(transformation.content);
        } else if (transformation.type === "insertAfter") {
          result.push(line);
          result.push(transformation.content);
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      result.push(line);
    }
  }

  fs.writeFileSync(filePath, result.join("\n"), "utf-8");
  console.log("Patched class.ts");
}

if (process.env.VERCEL === "1") {
  patchFile();
}
