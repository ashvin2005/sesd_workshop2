import { Command } from "commander";

/**
 * Abstract base class for all command handlers.
 * Each command group extends this class and implements the register() method.
 */
abstract class CommandHandler {
  protected name: string;
  protected description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  /**
   * Registers all commands of this handler onto the given Commander program.
   * Must be implemented by each subclass.
   */
  abstract register(program: Command): void;

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }
}

export default CommandHandler;
