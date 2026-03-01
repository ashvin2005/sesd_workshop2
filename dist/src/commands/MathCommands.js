"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandHandler_1 = __importDefault(require("./CommandHandler"));
const display_1 = require("../utils/display");
/**
 * MathCommands — handles all arithmetic operations.
 * Commands: add, subtract, multiply, divide, modulo, power, factorial
 */
class MathCommands extends CommandHandler_1.default {
    constructor() {
        super("math", "Mathematical computation commands");
    }
    factorial(n) {
        if (n === 0 || n === 1)
            return 1;
        return n * this.factorial(n - 1);
    }
    register(program) {
        program
            .command("add <num1> <num2>")
            .description("Add two numbers")
            .action((num1, num2) => {
            const result = Number(num1) + Number(num2);
            (0, display_1.header)("Addition");
            (0, display_1.success)(`${num1} + ${num2} = ${result}`);
        });
        program
            .command("subtract <num1> <num2>")
            .description("Subtract two numbers")
            .action((num1, num2) => {
            const result = Number(num1) - Number(num2);
            (0, display_1.header)("Subtraction");
            (0, display_1.success)(`${num1} - ${num2} = ${result}`);
        });
        program
            .command("multiply <num1> <num2>")
            .description("Multiply two numbers")
            .action((num1, num2) => {
            const result = Number(num1) * Number(num2);
            (0, display_1.header)("Multiplication");
            (0, display_1.success)(`${num1} × ${num2} = ${result}`);
        });
        program
            .command("divide <num1> <num2>")
            .description("Divide two numbers")
            .action((num1, num2) => {
            (0, display_1.header)("Division");
            if (Number(num2) === 0) {
                (0, display_1.error)("Division by zero is not allowed.");
                return;
            }
            const result = Number(num1) / Number(num2);
            (0, display_1.success)(`${num1} ÷ ${num2} = ${result}`);
        });
        program
            .command("modulo <num1> <num2>")
            .description("Modulo (remainder) of two numbers")
            .action((num1, num2) => {
            (0, display_1.header)("Modulo");
            if (Number(num2) === 0) {
                (0, display_1.error)("Modulo by zero is not allowed.");
                return;
            }
            const result = Number(num1) % Number(num2);
            (0, display_1.success)(`${num1} % ${num2} = ${result}`);
        });
        program
            .command("power <base> <exponent>")
            .description("Raise a base number to an exponent")
            .action((base, exponent) => {
            (0, display_1.header)("Power");
            const result = Math.pow(Number(base), Number(exponent));
            (0, display_1.success)(`${base} ^ ${exponent} = ${result}`);
        });
        program
            .command("factorial <num>")
            .description("Compute the factorial of a non-negative integer")
            .action((num) => {
            (0, display_1.header)("Factorial");
            const n = Number(num);
            if (!Number.isInteger(n) || n < 0) {
                (0, display_1.error)("Factorial requires a non-negative integer.");
                return;
            }
            const result = this.factorial(n);
            (0, display_1.success)(`${n}! = ${result}`);
        });
    }
}
exports.default = MathCommands;
