/**
 * Message logged to the console.
 */
export type ConsoleMessage = {
  type: "log" | "error" | "warn" | "info" | "success";
  text: string;
};

/**
 * Console for the interpreter.
 */
export interface InterpreterConsole {
  /**
   * Logs the given message to the console.
   * @param message The message to log.
   */
  log(message: ConsoleMessage): void;

  /**
   * Appends the given message to the last message regardless of its type.
   *
   * If there is no last message, it behaves the same as log.
   * @param message The message to append.
   */
  append(message: ConsoleMessage): void;
}

type Logger = (message: ConsoleMessage, append: boolean) => void;

/**
 * Implementation of the interpreter console that uses a logger function to log messages.
 */
export class InterpreterConsoleImpl implements InterpreterConsole {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  log(message: ConsoleMessage): void {
    this.logger(message, false);
  }

  append(message: ConsoleMessage): void {
    this.logger(message, true);
  }
}
