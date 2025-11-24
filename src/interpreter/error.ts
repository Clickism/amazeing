/**
 * Error class for attaching tips to errors.
 */
export class ErrorWithTip extends Error {
  tip: string | null;
  constructor(message: string, tip: string | null = null) {
    super(message);
    this.name = "ErrorWithTip";
    this.tip = tip;
  }
}

/**
 * Error class for attaching line numbers to errors.
 */
export class LocatableError extends ErrorWithTip {
  constructor(lineNumber: number, message: string, tip: string | null = null) {
    super(`Error on line ${lineNumber}: ${message}`, tip);
    this.name = "LocatableError";
  }
}
