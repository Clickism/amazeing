import type { Instruction, InstructionData, Value } from "./instruction.ts";

const COMMENT_PREFIX = "#";

/**
 * Parses the given code into an array of instructions.
 *
 * @param code The code to parse
 * @throws {ParseError} if the code contains syntax errors
 */
export function parse(code: string): InstructionData[] {
  const lines = code.split("\n");
  const instructions: InstructionData[] = [];
  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const line = lines[i].trim();
    const instruction = parseLine(line, lineNumber);
    if (instruction === null) continue;
    instructions.push(instruction);
  }
  return instructions;
}

/**
 * Parses a single line of code into an instruction.
 *
 * @param line The line to parse
 * @param lineNumber The line number (for error reporting)
 * @throws {ParseError} if the line contains syntax errors
 */
function parseLine(line: string, lineNumber: number): InstructionData | null {
  if (line === "" || line.startsWith(COMMENT_PREFIX)) {
    return null;
  }
  const parts = line.split(/\s+/);
  const [instructionType, ...args] = parts;
  try {
    const instruction = parseInstruction(instructionType, args);
    return { instruction, line: lineNumber };
  } catch (error) {
    if (error instanceof PartialParseError) {
      throw new ParseError(lineNumber, error.message);
    }
    throw error;
  }
}

/**
 * @throws {PartialParseError} if parsing fails
 */
function parseInstruction(type: string, args: string[]): Instruction {
  switch (type) {
    // No var instructions
    case "move":
    case "ret":
      assertArgsLength(type, args, 0);
      return { type };
    // One var instructions
    case "print":
      assertArgsLength(type, args, 1);
      return { type, src: parseIdentifier(args[0]) };
    // Two var instructions
    case "copy":
    case "not":
      assertArgsLength(type, args, 2);
      return {
        type,
        dest: parseIdentifier(args[0]),
        src: parseIdentifier(args[1]),
      };
    // Three var instructions
    case "add":
    case "sub":
    case "mul":
    case "div":
    case "and":
    case "or":
    case "xor":
    case "lt":
    case "lte":
    case "gt":
    case "gte":
    case "eq":
    case "neq":
      assertArgsLength(type, args, 3);
      return {
        type,
        dest: parseIdentifier(args[0]),
        src1: parseIdentifier(args[1]),
        src2: parseIdentifier(args[2]),
      };
    // Control flow instructions
    case "jump":
    case "call":
      assertArgsLength(type, args, 1);
      return { type, target: parseValue(args[0]) };
    case "branch":
    case "branchz":
      assertArgsLength(type, args, 2);
      return {
        type,
        cond: parseIdentifier(args[0]),
        target: parseValue(args[1]),
      };
    // Other instructions
    case "turn":
      assertArgsLength(type, args, 1);
      return { type: "turn", direction: parseDirection(args[0]) };
    case "var":
      assertArgsLength(type, args, 1);
      return { type: "var", name: parseIdentifier(args[0]) };
    case "load":
      assertArgsLength(type, args, 2);
      return {
        type: "load",
        dest: parseIdentifier(args[0]),
        value: parseValue(args[1]),
      };
    default:
      throw new PartialParseError(`Unknown instruction: "${type}"`);
  }
}

function parseDirection(arg: string): "left" | "right" {
  if (arg === "left" || arg === "right") {
    return arg;
  }
  throw new PartialParseError(`Invalid direction: "${arg}"`);
}

function parseIdentifier(arg: string): string {
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(arg)) {
    return arg;
  }
  throw new PartialParseError(
    `Invalid identifier: "${arg}", must start with a letter and only contain letters, numbers, and underscores`,
  );
}

function parseValue(arg: string): Value {
  const value = Number(arg);
  if (isNaN(value)) {
    throw new PartialParseError(`Invalid value: "${arg}", must be a number`);
  }
  return value;
}

/**
 * @throws {PartialParseError} if the number of arguments is incorrect
 */
function assertArgsLength(
  instructionType: Instruction["type"],
  args: string[],
  expected: number,
) {
  if (args.length !== expected) {
    throw new PartialParseError(
      `Expected ${expected} arguments for "${instructionType}", got ${args.length}`,
    );
  }
}

class PartialParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PartialParseError";
  }
}

class ParseError extends Error {
  constructor(lineNumber: number, message: string) {
    super(`${lineNumber}: ${message}`);
    this.name = "ParseError";
  }
}
