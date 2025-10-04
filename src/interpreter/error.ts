export class LocatableError extends Error {
  constructor(lineNumber: number, message: string) {
    super(`Error on line ${lineNumber}: ${message}`);
    this.name = "ParseError";
  }
}
