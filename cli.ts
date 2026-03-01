#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
const boxen = require("boxen");

import MathCommands from "./src/commands/MathCommands";
import FileCommands from "./src/commands/FileCommands";
import APICommands from "./src/commands/APICommands";
import UtilityCommands from "./src/commands/UtilityCommands";

const program = new Command();


const banner = boxen(
    chalk.cyanBright.bold("  MyCLI  ") +
    "\n" +
    chalk.gray("  A powerful CLI tool by Ashvin  ") +
    "\n" +
    chalk.gray("  Node.js + TypeScript + OOP  "),
    {
        padding: 1,
        borderStyle: "round",
        borderColor: "cyan",
        margin: { top: 0, bottom: 1, left: 0, right: 0 },
    }
);


program
    .name("mycli")
    .description(
        chalk.cyanBright("A feature-rich CLI tool built with Node.js + TypeScript")
    )
    .version(chalk.greenBright("1.0.0"), "-v, --version", "Display the current version")
    .addHelpText("beforeAll", banner);


const handlers = [
    new MathCommands(),
    new FileCommands(),
    new APICommands(),
    new UtilityCommands(),
];

handlers.forEach((handler) => handler.register(program));


program.parse(process.argv);