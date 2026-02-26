#!/usr/bin/env node
const { Command } = require("commander");
const axios = require("axios");
const program = new Command();
program.command("greet <name>") //variable in angular bracket
    .action((name) => { console.log(`Hello ${name}`); });
program.command("add <num1> <num2>")
    .description("Add two numbers")
    .action((num1, num2) => { console.log(`The sum is ${Number(num1) + Number(num2)}`); });
program.command("subtract <num1> <num2>")
    .description("Subtract two numbers")
    .action((num1, num2) => { console.log(`The difference is ${Number(num1) - Number(num2)}`); });
program.command("multiply <num1> <num2>")
    .description("Multiply two numbers")
    .action((num1, num2) => { console.log(`The product is ${Number(num1) * Number(num2)}`); });
program.command("divide <num1> <num2>")
    .description("Divide two numbers")
    .action((num1, num2) => {
    if (Number(num2) === 0) {
        console.log("Error: Division by zero is not allowed.");
    }
    else {
        console.log(`The quotient is ${Number(num1) / Number(num2)}`);
    }
});
program.command("modulo <num1> <num2>")
    .description("Modulo of two numbers")
    .action((num1, num2) => {
    if (Number(num2) === 0) {
        console.log("Error: Modulo by zero is not allowed.");
    }
    else {
        console.log(`The modulo is ${Number(num1) % Number(num2)}`);
    }
});
program.command("power <base> <exponent>")
    .description("Power of a number")
    .action((base, exponent) => {
    console.log(`The result is ${Math.pow(Number(base), Number(exponent))}`);
});
program.command("factorial <num>")
    .description("Factorial of a number")
    .action((num) => {
    const n = Number(num);
    if (n < 0) {
        console.log("Error: Factorial is not defined for negative numbers.");
    }
    else {
        let fact = 1;
        for (let i = 2; i <= n; i++) {
            fact *= i;
        }
        console.log(`The factorial is ${fact}`);
    }
});
program.command("joke")
    .description("Random joke")
    .action(async () => {
    try {
        const res = await axios.get("https://official-joke-api.appspot.com/random_joke");
        const joke = res.data;
        console.log(`${joke.setup} - ${joke.punchline}`);
    }
    catch (err) {
        console.error(err);
    }
});
program.command("quote")
    .description("Random quote")
    .action(async () => {
    try {
        const res = await axios.get("https://api.quotable.io/random");
        const quote = res.data;
        console.log(`${quote.content} - ${quote.author}`);
    }
    catch (err) {
        console.error(err);
    }
});
program.parse(); //written at the end
