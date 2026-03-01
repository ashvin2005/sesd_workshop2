import chalk from "chalk";



export function success(msg: string): void {
    console.log(chalk.green("[ok] ") + chalk.greenBright(msg));
}

export function error(msg: string): void {
    console.error(chalk.red("[err] ") + chalk.redBright(msg));
}

export function info(msg: string): void {
    console.log(chalk.cyan("[i] ") + chalk.cyanBright(msg));
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
    console.log(chalk.yellow("[!] ") + chalk.yellowBright(msg));
}
