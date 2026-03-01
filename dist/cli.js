#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const boxen = require("boxen");
const MathCommands_1 = __importDefault(require("./src/commands/MathCommands"));
const FileCommands_1 = __importDefault(require("./src/commands/FileCommands"));
const APICommands_1 = __importDefault(require("./src/commands/APICommands"));
const UtilityCommands_1 = __importDefault(require("./src/commands/UtilityCommands"));
const program = new commander_1.Command();
// ── Banner ───────────────────────────────────────────────────────────────────
const banner = boxen(chalk_1.default.cyanBright.bold("  MyCLI  ") +
    "\n" +
    chalk_1.default.gray("  A powerful CLI tool by Ashvin  ") +
    "\n" +
    chalk_1.default.gray("  Node.js + TypeScript + OOP  "), {
    padding: 1,
    borderStyle: "round",
    borderColor: "cyan",
    margin: { top: 0, bottom: 1, left: 0, right: 0 },
});
// ── Program meta ─────────────────────────────────────────────────────────────
program
    .name("mycli")
    .description(chalk_1.default.cyanBright("A feature-rich CLI tool built with Node.js + TypeScript"))
    .version(chalk_1.default.greenBright("1.0.0"), "-v, --version", "Display the current version")
    .addHelpText("beforeAll", banner);
// ── Register all command handlers ─────────────────────────────────────────────
const handlers = [
    new MathCommands_1.default(),
    new FileCommands_1.default(),
    new APICommands_1.default(),
    new UtilityCommands_1.default(),
];
handlers.forEach((handler) => handler.register(program));
// ── Parse ─────────────────────────────────────────────────────────────────────
program.parse(process.argv);
