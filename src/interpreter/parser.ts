import type {
  Instruction,
  InstructionData,
  LabelDefinition,
  Value,
} from "./instruction.ts";
import { LocatableError } from "./error.ts";

const COMMENT_PREFIX = "#";

/**
 * Parses the given code into an array of instructions.
 *
 * @param code The code to parse
 * @throws {LocatableError} if the code contains syntax errors
 */
export function parse(code: string): {
  instructions: InstructionData[];
  labels: Map<string, LabelDefinition>;
} {
  const lines = code.split("\n");
  const instructions: InstructionData[] = [];
  const labels: Map<string, LabelDefinition> = new Map();
  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const line = lines[i].trim();
    const parsed = parseLine(line, lineNumber);
    if (parsed === null) continue;
    if ("label" in parsed) {
      // Label definition
      if (labels.has(parsed.label)) {
        throw new LocatableError(
          lineNumber,
          `Label "${parsed.label}" already defined on line ${labels.get(parsed.label)?.pc}`,
        );
      }
      // Set the instruction index to the next instruction to be added
      parsed.pc = instructions.length;
      labels.set(parsed.label, parsed);
    } else {
      // Instruction
      instructions.push(parsed);
    }
  }
  return { instructions, labels };
}

/**
 * Parses a single line of code into an instruction.
 *
 * @param line The line to parse
 * @param lineNumber The line number (for error reporting)
 * @throws {LocatableError} if the line contains syntax errors
 */
function parseLine(
  line: string,
  lineNumber: number,
): InstructionData | LabelDefinition | null {
  if (line === "" || line.startsWith(COMMENT_PREFIX)) {
    return null;
  }
  if (line.endsWith(":")) {
    // Label definition
    const label = line.slice(0, -1).trim();
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(label)) {
      throw new LocatableError(
        lineNumber,
        `Invalid label name: "${label}", must start with a letter and only contain letters, numbers, and underscores`,
      );
    }
    // Set instructionIndex to 0 temporarily
    return { label, pc: 0 };
  }
  const parts = line.split(/\s+/);
  const [instructionType, ...args] = parts;
  try {
    const instruction = parseInstruction(instructionType, args);
    return { instruction, line: lineNumber };
  } catch (err) {
    if (err instanceof Error) {
      throw new LocatableError(lineNumber, err.message);
    }
    throw err;
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
      return { type, target: parseIdentifier(args[0]) };
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
      throw new Error(`Unknown instruction: "${type}"`);
  }
}

function parseDirection(arg: string): "left" | "right" {
  if (arg === "left" || arg === "right") {
    return arg;
  }
  throw new Error(`Invalid direction: "${arg}"`);
}

function parseIdentifier(arg: string): string {
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(arg)) {
    return arg;
  }
  throw new Error(
    `Invalid identifier: "${arg}", must start with a letter and only contain letters, numbers, and underscores`,
  );
}

function parseValue(arg: string): Value {
  const value = Number(arg);
  if (isNaN(value)) {
    throw new Error(`Invalid value: "${arg}", must be a number`);
  }
  return value;
}

/**
 * @throws {Error} if the number of arguments is incorrect
 */
function assertArgsLength(
  instructionType: Instruction["type"],
  args: string[],
  expected: number,
) {
  if (args.length !== expected) {
    throw new Error(
      `Expected ${expected} argument(s) for "${instructionType}", but got ${args.length} instead`,
    );
  }
}
