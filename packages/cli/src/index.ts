import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { version } from "../package.json";

const main = () => {
  const program = new Command();

  program
    .name("Next-Admin CLI")
    .description("CLI for Next-Admin")
    .version(version);

  initCommand(program);

  program.parse(process.argv);
};

main();
