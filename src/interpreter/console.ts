/**
 * Message logged to the console.
 */
export type ConsoleMessage = {
  type: "log" | "error" | "warn";
  message: string;
};

/**
 * Console for the interpreter.
 */
export class InterpreterConsole {
  logger: (message: ConsoleMessage) => void;

  constructor(logger: (message: ConsoleMessage) => void) {
    this.logger = logger;
  }

  log(message: ConsoleMessage) {
    this.logger(message);
  }
}
