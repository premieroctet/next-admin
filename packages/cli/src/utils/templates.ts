import path from "path";
import fs from "fs";
import Mustache from "mustache";

export const writeToTemplate = (
  templateName: string,
  context: Record<string, string | boolean>
) => {
  const template = fs.readFileSync(
    path.join(__dirname, "templates", `${templateName}.mustache`),
    "utf-8"
  );

  return Mustache.render(template, context, undefined, {
    escape: (value) => value,
  });
};
