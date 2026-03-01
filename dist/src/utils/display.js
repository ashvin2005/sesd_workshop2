"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = success;
exports.error = error;
exports.info = info;
exports.label = label;
exports.header = header;
exports.divider = divider;
exports.warn = warn;
const chalk_1 = __importDefault(require("chalk"));
/**
 * Shared display helpers for consistent, colored CLI output.
 */
function success(msg) {
    console.log(chalk_1.default.green("✔ ") + chalk_1.default.greenBright(msg));
}
function error(msg) {
    console.error(chalk_1.default.red("✖ ") + chalk_1.default.redBright(msg));
}
function info(msg) {
    console.log(chalk_1.default.cyan("ℹ ") + chalk_1.default.cyanBright(msg));
}
function label(key, value) {
    console.log(chalk_1.default.yellow.bold(key + ":") + " " + chalk_1.default.white(String(value)));
}
function header(title) {
    console.log("\n" + chalk_1.default.magentaBright.bold("══ " + title + " ══") + "\n");
}
function divider() {
    console.log(chalk_1.default.gray("────────────────────────────────────"));
}
function warn(msg) {
    console.log(chalk_1.default.yellow("⚠ ") + chalk_1.default.yellowBright(msg));
}
