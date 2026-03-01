import { Command } from "commander";

abstract class CommandHandler {
  protected name: string;
  protected description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }


  abstract register(program: Command): void;

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }
}

export default CommandHandler;
