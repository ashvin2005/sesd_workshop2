import { Command } from "commander";
import CommandHandler from "./CommandHandler";
import { success, error, header } from "../utils/display";

/**
 * MathCommands — handles all arithmetic operations.
 * Commands: add, subtract, multiply, divide, modulo, power, factorial
 */
class MathCommands extends CommandHandler {
    constructor() {
        super("math", "Mathematical computation commands");
    }

    private factorial(n: number): number {
        if (n === 0 || n === 1) return 1;
        return n * this.factorial(n - 1);
    }

    register(program: Command): void {
        program
            .command("add <num1> <num2>")
            .description("Add two numbers")
            .action((num1: string, num2: string) => {
                const result = Number(num1) + Number(num2);
                header("Addition");
                success(`${num1} + ${num2} = ${result}`);
            });

        program
            .command("subtract <num1> <num2>")
            .description("Subtract two numbers")
            .action((num1: string, num2: string) => {
                const result = Number(num1) - Number(num2);
                header("Subtraction");
                success(`${num1} - ${num2} = ${result}`);
            });

        program
            .command("multiply <num1> <num2>")
            .description("Multiply two numbers")
            .action((num1: string, num2: string) => {
                const result = Number(num1) * Number(num2);
                header("Multiplication");
                success(`${num1} × ${num2} = ${result}`);
            });

        program
            .command("divide <num1> <num2>")
            .description("Divide two numbers")
            .action((num1: string, num2: string) => {
                header("Division");
                if (Number(num2) === 0) {
                    error("Division by zero is not allowed.");
                    return;
                }
                const result = Number(num1) / Number(num2);
                success(`${num1} ÷ ${num2} = ${result}`);
            });

        program
            .command("modulo <num1> <num2>")
            .description("Modulo (remainder) of two numbers")
            .action((num1: string, num2: string) => {
                header("Modulo");
                if (Number(num2) === 0) {
                    error("Modulo by zero is not allowed.");
                    return;
                }
                const result = Number(num1) % Number(num2);
                success(`${num1} % ${num2} = ${result}`);
            });

        program
            .command("power <base> <exponent>")
            .description("Raise a base number to an exponent")
            .action((base: string, exponent: string) => {
                header("Power");
                const result = Math.pow(Number(base), Number(exponent));
                success(`${base} ^ ${exponent} = ${result}`);
            });

        program
            .command("factorial <num>")
            .description("Compute the factorial of a non-negative integer")
            .action((num: string) => {
                header("Factorial");
                const n = Number(num);
                if (!Number.isInteger(n) || n < 0) {
                    error("Factorial requires a non-negative integer.");
                    return;
                }
                const result = this.factorial(n);
                success(`${n}! = ${result}`);
            });
    }
}

export default MathCommands;
