/**
 * Message logged to the console.
 */
export type ConsoleMessage = {
  type: "log" | "error" | "warn" | "info" | "success" | "system";
  text: string;
};

/**
 * Console for the interpreter.
 */
export class InterpreterConsole {
  /**
   * Messages
   */
  output: ConsoleMessage[] = [];

  /**
   * Logs the given message to the console.
   *
   * Should not print a newline unless explicitly printed.
   *
   * @param message The message to log.
   */
  log(message: ConsoleMessage) {
    this.output.push(message);
  }

  /**
   * Clears the console.
   */
  clear(): void {
    this.output = [];
  }
}
