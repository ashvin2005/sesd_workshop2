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
program.command("joke")
    .description("Random joke")
    .action(async () => {
    try {
        const res = await axios.get("https://official-joke-api.appspot.com/random_joke");
        const joke = res.data;
        console.log(`${joke.setup} - ${joke.punchline}`);
    }
    catch (error) {
        console.error("Error fetching joke:", error);
    }
});
program.parse(); //written at the end
