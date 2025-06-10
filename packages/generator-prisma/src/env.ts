import { EnvValue } from "@prisma/generator-helper";
import { parseEnvValue } from "@prisma/internals";

export const getEnvValue = (value: string | EnvValue | undefined) => {
  if (typeof value === "string" || !value) {
    return value;
  }
  return parseEnvValue(value);
};
