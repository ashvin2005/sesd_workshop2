"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Abstract base class for all command handlers.
 * Each command group extends this class and implements the register() method.
 */
class CommandHandler {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
}
exports.default = CommandHandler;
