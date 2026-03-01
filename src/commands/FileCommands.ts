import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import CommandHandler from "./CommandHandler";
import { success, error, label, header, divider } from "../utils/display";
import chalk from "chalk";
const Table = require("cli-table3");


class FileCommands extends CommandHandler {
    constructor() {
        super("file", "File system utility commands");
    }

    register(program: Command): void {

        program
            .command("fileinfo <filepath>")
            .description("Display detailed information about a file")
            .action((filepath: string) => {
                header("File Info");
                const resolved = path.resolve(filepath);
                if (!fs.existsSync(resolved)) {
                    error(`File not found: ${filepath}`);
                    return;
                }
                const stats = fs.statSync(resolved);
                const sizeKB = (stats.size / 1024).toFixed(2);

                label("Path", resolved);
                label("Type", stats.isDirectory() ? "Directory" : stats.isSymbolicLink() ? "Symlink" : "File");
                label("Size", `${stats.size} bytes (${sizeKB} KB)`);
                label("Extension", path.extname(filepath) || "none");
                label("Created", stats.birthtime.toLocaleString());
                label("Modified", stats.mtime.toLocaleString());
                label("Permissions (mode)", (stats.mode & 0o777).toString(8));
            });


        program
            .command("readfile <filepath>")
            .description("Read and display the contents of a file")
            .option("-l, --lines <n>", "Show only the first N lines", "")
            .action((filepath: string, options: { lines: string }) => {
                header("Read File");
                const resolved = path.resolve(filepath);
                if (!fs.existsSync(resolved)) {
                    error(`File not found: ${filepath}`);
                    return;
                }
                if (fs.statSync(resolved).isDirectory()) {
                    error("Path is a directory, not a file. Use 'listdir' instead.");
                    return;
                }
                let content = fs.readFileSync(resolved, "utf-8");
                if (options.lines) {
                    const n = parseInt(options.lines, 10);
                    if (isNaN(n) || n <= 0) {
                        error("--lines must be a positive integer.");
                        return;
                    }
                    content = content.split("\n").slice(0, n).join("\n");
                    success(`Showing first ${n} lines of ${path.basename(filepath)}:`);
                } else {
                    success(`Contents of ${path.basename(filepath)}:`);
                }
                divider();
                console.log(chalk.white(content));
                divider();
            });


        program
            .command("listdir [dirpath]")
            .description("List all files and folders in a directory")
            .option("-a, --all", "Include hidden files and folders")
            .action((dirpath: string = ".", options: { all: boolean }) => {
                header("List Directory");
                const resolved = path.resolve(dirpath);
                if (!fs.existsSync(resolved)) {
                    error(`Directory not found: ${dirpath}`);
                    return;
                }
                if (!fs.statSync(resolved).isDirectory()) {
                    error(`Path is not a directory: ${dirpath}`);
                    return;
                }

                let entries = fs.readdirSync(resolved, { withFileTypes: true });
                if (!options.all) {
                    entries = entries.filter((e) => !e.name.startsWith("."));
                }

                const table = new Table({
                    head: [
                        chalk.cyan.bold("Name"),
                        chalk.cyan.bold("Type"),
                        chalk.cyan.bold("Size (KB)"),
                    ],
                    style: { border: ["gray"] },
                });

                entries.forEach((entry) => {
                    const fullPath = path.join(resolved, entry.name);
                    const stats = fs.statSync(fullPath);
                    const isDir = entry.isDirectory();
                    const name = isDir ? chalk.blueBright(entry.name + "/") : chalk.white(entry.name);
                    const type = isDir ? chalk.blue("dir") : chalk.gray("file");
                    const size = isDir ? "-" : (stats.size / 1024).toFixed(2);
                    table.push([name, type, size]);
                });

                success(`Listing: ${resolved}`);
                console.log(table.toString());
            });
    }
}

export default FileCommands;
