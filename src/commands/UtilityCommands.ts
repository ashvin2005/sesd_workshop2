import { Command } from "commander";
import { v4 as uuidv4 } from "uuid";
import CommandHandler from "./CommandHandler";
import { success, error, label, header, divider, info } from "../utils/display";
import chalk from "chalk";

/**
 * UtilityCommands — general-purpose utilities.
 * Commands: greet, time, uuid, base64, password
 */
class UtilityCommands extends CommandHandler {
    constructor() {
        super("utility", "General-purpose utility commands");
    }

    /**
     * Generates a random password from a character pool.
     */
    private generatePassword(length: number): string {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }
        return password;
    }

    register(program: Command): void {
        // ── greet <name> [--shout] ──────────────────────────
        program
            .command("greet <name>")
            .description("Greet someone by name")
            .option("-s, --shout", "Shout the greeting in uppercase")
            .action((name: string, options: { shout: boolean }) => {
                header("Greeting 👋");
                let msg = `Hello, ${name}! Welcome to MyCLI. Have a great day!`;
                if (options.shout) {
                    msg = msg.toUpperCase();
                    console.log(chalk.redBright.bold(msg));
                } else {
                    console.log(chalk.greenBright(msg));
                }
            });

        // ── time [timezone] ─────────────────────────────────
        program
            .command("time [timezone]")
            .description("Display the current date and time (optionally in a timezone)")
            .action((timezone?: string) => {
                header("Current Time 🕐");
                const opts: Intl.DateTimeFormatOptions = {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                    timeZoneName: "short",
                };
                if (timezone) {
                    try {
                        opts.timeZone = timezone;
                    } catch {
                        error(`Invalid timezone: "${timezone}". Using local time.`);
                    }
                }
                const now = new Date();
                const formatted = new Intl.DateTimeFormat("en-US", opts).format(now);
                label("Timezone", timezone ?? "Local");
                success(formatted);
            });

        // ── uuid ────────────────────────────────────────────
        program
            .command("uuid")
            .description("Generate a random UUID v4")
            .option("-c, --count <n>", "Generate N UUIDs", "1")
            .action((options: { count: string }) => {
                header("UUID Generator 🔑");
                const n = parseInt(options.count, 10);
                if (isNaN(n) || n < 1) {
                    error("--count must be a positive integer.");
                    return;
                }
                for (let i = 0; i < n; i++) {
                    console.log(chalk.cyanBright(`  ${i + 1}. ${uuidv4()}`));
                }
            });

        // ── base64 <encode|decode> <text> ───────────────────
        program
            .command("base64 <action> <text>")
            .description("Encode or decode a string in Base64 (action: encode | decode)")
            .action((action: string, text: string) => {
                header("Base64 Tool 🔐");
                if (action === "encode") {
                    const encoded = Buffer.from(text, "utf-8").toString("base64");
                    label("Input", text);
                    success(`Encoded: ${encoded}`);
                } else if (action === "decode") {
                    try {
                        const decoded = Buffer.from(text, "base64").toString("utf-8");
                        label("Input", text);
                        success(`Decoded: ${decoded}`);
                    } catch {
                        error("Invalid Base64 string.");
                    }
                } else {
                    error(`Unknown action "${action}". Use "encode" or "decode".`);
                }
            });

        // ── password [--length <n>] ──────────────────────────
        program
            .command("password")
            .description("Generate a cryptographically strong random password")
            .option("-l, --length <n>", "Password length (default: 16)", "16")
            .option("-c, --count <n>", "Number of passwords to generate", "1")
            .action((options: { length: string; count: string }) => {
                header("Password Generator 🔒");
                const length = parseInt(options.length, 10);
                const count = parseInt(options.count, 10);
                if (isNaN(length) || length < 6) {
                    error("Password length must be at least 6.");
                    return;
                }
                if (isNaN(count) || count < 1) {
                    error("--count must be a positive integer.");
                    return;
                }
                info(`Generating ${count} password(s) of length ${length}:`);
                divider();
                for (let i = 0; i < count; i++) {
                    console.log(chalk.greenBright(`  ${i + 1}. ${this.generatePassword(length)}`));
                }
                divider();
            });
    }
}

export default UtilityCommands;
