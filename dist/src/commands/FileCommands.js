"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const CommandHandler_1 = __importDefault(require("./CommandHandler"));
const display_1 = require("../utils/display");
const chalk_1 = __importDefault(require("chalk"));
const Table = require("cli-table3");
/**
 * FileCommands — file system utilities.
 * Commands: fileinfo, readfile, listdir
 */
class FileCommands extends CommandHandler_1.default {
    constructor() {
        super("file", "File system utility commands");
    }
    register(program) {
        // fileinfo <filepath>
        program
            .command("fileinfo <filepath>")
            .description("Display detailed information about a file")
            .action((filepath) => {
            (0, display_1.header)("File Info");
            const resolved = path.resolve(filepath);
            if (!fs.existsSync(resolved)) {
                (0, display_1.error)(`File not found: ${filepath}`);
                return;
            }
            const stats = fs.statSync(resolved);
            const sizeKB = (stats.size / 1024).toFixed(2);
            (0, display_1.label)("Path", resolved);
            (0, display_1.label)("Type", stats.isDirectory() ? "Directory" : stats.isSymbolicLink() ? "Symlink" : "File");
            (0, display_1.label)("Size", `${stats.size} bytes (${sizeKB} KB)`);
            (0, display_1.label)("Extension", path.extname(filepath) || "none");
            (0, display_1.label)("Created", stats.birthtime.toLocaleString());
            (0, display_1.label)("Modified", stats.mtime.toLocaleString());
            (0, display_1.label)("Permissions (mode)", (stats.mode & 0o777).toString(8));
        });
        // readfile <filepath> [--lines <n>]
        program
            .command("readfile <filepath>")
            .description("Read and display the contents of a file")
            .option("-l, --lines <n>", "Show only the first N lines", "")
            .action((filepath, options) => {
            (0, display_1.header)("Read File");
            const resolved = path.resolve(filepath);
            if (!fs.existsSync(resolved)) {
                (0, display_1.error)(`File not found: ${filepath}`);
                return;
            }
            if (fs.statSync(resolved).isDirectory()) {
                (0, display_1.error)("Path is a directory, not a file. Use 'listdir' instead.");
                return;
            }
            let content = fs.readFileSync(resolved, "utf-8");
            if (options.lines) {
                const n = parseInt(options.lines, 10);
                if (isNaN(n) || n <= 0) {
                    (0, display_1.error)("--lines must be a positive integer.");
                    return;
                }
                content = content.split("\n").slice(0, n).join("\n");
                (0, display_1.success)(`Showing first ${n} lines of ${path.basename(filepath)}:`);
            }
            else {
                (0, display_1.success)(`Contents of ${path.basename(filepath)}:`);
            }
            (0, display_1.divider)();
            console.log(chalk_1.default.white(content));
            (0, display_1.divider)();
        });
        // listdir [dirpath] [--all]
        program
            .command("listdir [dirpath]")
            .description("List all files and folders in a directory")
            .option("-a, --all", "Include hidden files and folders")
            .action((dirpath = ".", options) => {
            (0, display_1.header)("List Directory");
            const resolved = path.resolve(dirpath);
            if (!fs.existsSync(resolved)) {
                (0, display_1.error)(`Directory not found: ${dirpath}`);
                return;
            }
            if (!fs.statSync(resolved).isDirectory()) {
                (0, display_1.error)(`Path is not a directory: ${dirpath}`);
                return;
            }
            let entries = fs.readdirSync(resolved, { withFileTypes: true });
            if (!options.all) {
                entries = entries.filter((e) => !e.name.startsWith("."));
            }
            const table = new Table({
                head: [
                    chalk_1.default.cyan.bold("Name"),
                    chalk_1.default.cyan.bold("Type"),
                    chalk_1.default.cyan.bold("Size (KB)"),
                ],
                style: { border: ["gray"] },
            });
            entries.forEach((entry) => {
                const fullPath = path.join(resolved, entry.name);
                const stats = fs.statSync(fullPath);
                const isDir = entry.isDirectory();
                const name = isDir ? chalk_1.default.blueBright(entry.name + "/") : chalk_1.default.white(entry.name);
                const type = isDir ? chalk_1.default.blue("dir") : chalk_1.default.gray("file");
                const size = isDir ? "-" : (stats.size / 1024).toFixed(2);
                table.push([name, type, size]);
            });
            (0, display_1.success)(`Listing: ${resolved}`);
            console.log(table.toString());
        });
    }
}
exports.default = FileCommands;
