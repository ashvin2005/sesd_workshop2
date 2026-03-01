import chalk from "chalk";

/**
 * Shared display helpers for consistent, colored CLI output.
 */

export function success(msg: string): void {
    console.log(chalk.green("✔ ") + chalk.greenBright(msg));
}

export function error(msg: string): void {
    console.error(chalk.red("✖ ") + chalk.redBright(msg));
}

export function info(msg: string): void {
    console.log(chalk.cyan("ℹ ") + chalk.cyanBright(msg));
}

export function label(key: string, value: string | number): void {
    console.log(chalk.yellow.bold(key + ":") + " " + chalk.white(String(value)));
}

export function header(title: string): void {
    console.log("\n" + chalk.magentaBright.bold("══ " + title + " ══") + "\n");
}

export function divider(): void {
    console.log(chalk.gray("────────────────────────────────────"));
}

export function warn(msg: string): void {
    console.log(chalk.yellow("⚠ ") + chalk.yellowBright(msg));
}
