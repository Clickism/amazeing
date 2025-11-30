import type {
  Instruction,
  InstructionData,
  LabelDefinition,
} from "./instruction.ts";
import { ErrorWithTip, LocatableError } from "./error.ts";
import type { Address, ArrayIndex, LeftRight, Value } from "./types.ts";

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
  // Remove comments
  const [linePart] = line.split(COMMENT_PREFIX, 2);
  line = linePart.trim();
  if (line === "" || line.startsWith(COMMENT_PREFIX)) {
    return null;
  }
  // Parse
  try {
    // Check for label definition
    if (line.endsWith(":")) {
      return parseLabel(line);
    }
    // Parse instruction
    const instruction = parseInstruction(line);
    return { instruction, line: lineNumber };
  } catch (err) {
    // Add line number to error
    if (err instanceof Error) {
      if (err instanceof ErrorWithTip) {
        throw new LocatableError(lineNumber, err.message, err.tip);
      }
      throw new LocatableError(lineNumber, err.message);
    }
    throw err;
  }
}

/**
 * Parses a label definition.
 */
function parseLabel(line: string): LabelDefinition {
  // Label definition
  const label = line.slice(0, -1).trim();
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(label)) {
    throw new Error(
      `Invalid label name: "${label}", must start with a letter and only contain letters, numbers, and underscores`,
    );
  }
  // Set instructionIndex to 0 temporarily
  return { label, pc: 0 };
}

/**
 * Parses an instruction
 */
function parseInstruction(line: string): Instruction {
  const parts = line.split(/\s+/);
  const type = parts[0];
  const args = parts.slice(1);
  // Parse based on instruction type
  switch (type) {
    // No var instructions
    case "move":
    case "ret":
    case "exit":
      assertArgsLength(type, args, 0);
      return { type };
    // One var instructions
    case "print":
    case "debug":
      assertArgsLength(type, args, 1);
      return { type, src: parseAddress(args[0]) };
    // Two var instructions
    case "copy":
    case "not":
      assertArgsLength(type, args, 2);
      return {
        type,
        dest: parseAddress(args[0]),
        src: parseAddress(args[1]),
      };
    // Three var (intermediate) instructions
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
    case "sll":
    case "srl":
    case "sra":
      assertArgsLength(type, args, 3);
      return {
        type,
        dest: parseAddress(args[0]),
        src1: parseAddress(args[1]),
        src2: parseAddressOrValue(args[2]),
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
        cond: parseIdentifier(args[0]), // TODO: Address?
        target: parseIdentifier(args[1]),
      };
    // Other instructions
    case "turn":
      assertArgsLength(type, args, 1);
      return { type: "turn", direction: parseLeftRight(args[0]) };
    case "var": {
      assertArgsLength(type, args, 1);
      const { name, isArray } = parseVariableDefinition(args[0]);
      return { type: "var", name, isArray };
    }
    case "load":
      assertArgsLength(type, args, 2);
      return {
        type: "load",
        dest: parseAddress(args[0]),
        value: parseValue(args[1]),
      };
    default:
      throw new Error(`Unknown instruction: "${type}"`);
  }
}

/**
 * Parses an address (variable or array access).
 * @param arg The argument to parse
 */
function parseAddress(arg: string): Address {
  const match = arg.match(
    /^([a-zA-Z_][a-zA-Z_0-9]*)(?:\[([a-zA-Z_][a-zA-Z_0-9]*|[0-9]+)])?$/,
  );
  if (!match) {
    throw new Error(`Invalid address: "${arg}"`);
  }
  const name = match[1];
  let index: ArrayIndex = match[2];
  if (index === undefined) {
    return name; // Variable
  } else {
    if (!isNaN(Number(index))) {
      index = Number(index); // Numeric index
    }
    return { array: name, index }; // Array access
  }
}

function parseLeftRight(arg: string): LeftRight {
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

function parseVariableDefinition(arg: string): {
  name: string;
  isArray: boolean;
} {
  if (/^[a-zA-Z_][a-zA-Z0-9_]*\[]$/.test(arg)) {
    return { name: arg.slice(0, -2), isArray: true };
  }
  return { name: parseIdentifier(arg), isArray: false };
}

function parseAddressOrValue(arg: string): Address | Value {
  try {
    // Try value first because of constants
    return parseValue(arg);
  } catch {
    return parseAddress(arg);
  }
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
