"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const CommandHandler_1 = __importDefault(require("./CommandHandler"));
const display_1 = require("../utils/display");
const chalk_1 = __importDefault(require("chalk"));
/**
 * UtilityCommands — general-purpose utilities.
 * Commands: greet, time, uuid, base64, password
 */
class UtilityCommands extends CommandHandler_1.default {
    constructor() {
        super("utility", "General-purpose utility commands");
    }
    /**
     * Generates a random password from a character pool.
     */
    generatePassword(length) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }
        return password;
    }
    register(program) {
        // ── greet <name> [--shout] ──────────────────────────
        program
            .command("greet <name>")
            .description("Greet someone by name")
            .option("-s, --shout", "Shout the greeting in uppercase")
            .action((name, options) => {
            (0, display_1.header)("Greeting 👋");
            let msg = `Hello, ${name}! Welcome to MyCLI. Have a great day!`;
            if (options.shout) {
                msg = msg.toUpperCase();
                console.log(chalk_1.default.redBright.bold(msg));
            }
            else {
                console.log(chalk_1.default.greenBright(msg));
            }
        });
        // ── time [timezone] ─────────────────────────────────
        program
            .command("time [timezone]")
            .description("Display the current date and time (optionally in a timezone)")
            .action((timezone) => {
            (0, display_1.header)("Current Time 🕐");
            const opts = {
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
                }
                catch {
                    (0, display_1.error)(`Invalid timezone: "${timezone}". Using local time.`);
                }
            }
            const now = new Date();
            const formatted = new Intl.DateTimeFormat("en-US", opts).format(now);
            (0, display_1.label)("Timezone", timezone !== null && timezone !== void 0 ? timezone : "Local");
            (0, display_1.success)(formatted);
        });
        // ── uuid ────────────────────────────────────────────
        program
            .command("uuid")
            .description("Generate a random UUID v4")
            .option("-c, --count <n>", "Generate N UUIDs", "1")
            .action((options) => {
            (0, display_1.header)("UUID Generator 🔑");
            const n = parseInt(options.count, 10);
            if (isNaN(n) || n < 1) {
                (0, display_1.error)("--count must be a positive integer.");
                return;
            }
            for (let i = 0; i < n; i++) {
                console.log(chalk_1.default.cyanBright(`  ${i + 1}. ${(0, uuid_1.v4)()}`));
            }
        });
        // ── base64 <encode|decode> <text> ───────────────────
        program
            .command("base64 <action> <text>")
            .description("Encode or decode a string in Base64 (action: encode | decode)")
            .action((action, text) => {
            (0, display_1.header)("Base64 Tool 🔐");
            if (action === "encode") {
                const encoded = Buffer.from(text, "utf-8").toString("base64");
                (0, display_1.label)("Input", text);
                (0, display_1.success)(`Encoded: ${encoded}`);
            }
            else if (action === "decode") {
                try {
                    const decoded = Buffer.from(text, "base64").toString("utf-8");
                    (0, display_1.label)("Input", text);
                    (0, display_1.success)(`Decoded: ${decoded}`);
                }
                catch {
                    (0, display_1.error)("Invalid Base64 string.");
                }
            }
            else {
                (0, display_1.error)(`Unknown action "${action}". Use "encode" or "decode".`);
            }
        });
        // ── password [--length <n>] ──────────────────────────
        program
            .command("password")
            .description("Generate a cryptographically strong random password")
            .option("-l, --length <n>", "Password length (default: 16)", "16")
            .option("-c, --count <n>", "Number of passwords to generate", "1")
            .action((options) => {
            (0, display_1.header)("Password Generator 🔒");
            const length = parseInt(options.length, 10);
            const count = parseInt(options.count, 10);
            if (isNaN(length) || length < 6) {
                (0, display_1.error)("Password length must be at least 6.");
                return;
            }
            if (isNaN(count) || count < 1) {
                (0, display_1.error)("--count must be a positive integer.");
                return;
            }
            (0, display_1.info)(`Generating ${count} password(s) of length ${length}:`);
            (0, display_1.divider)();
            for (let i = 0; i < count; i++) {
                console.log(chalk_1.default.greenBright(`  ${i + 1}. ${this.generatePassword(length)}`));
            }
            (0, display_1.divider)();
        });
    }
}
exports.default = UtilityCommands;
