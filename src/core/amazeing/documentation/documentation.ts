import type { Instruction } from "../../interpreter/instruction.ts";

export type SingleDocumentation = {
  /**
   * Here there is a custom doc language used for highlighting.
   *
   * See: autocomplete.ts
   */
  usage: string;
  warning?: string;
  /**
   * Here, any quoted text will be highlighted.
   *
   * Used for highlighting parameters.
   */
  description: string;
};

export type Documentation = SingleDocumentation | SingleDocumentation[];

/**
 * Gets the documentation for the given instruction type.
 * @param instruction
 */
export function getInstructionDocumentation(
  instruction: string,
): Documentation | null {
  return (
    INSTRUCTION_DOCUMENTATION_LOOKUP[instruction as Instruction["type"]] ?? null
  );
}

const INSTRUCTION_DOCUMENTATION_LOOKUP: {
  [K in Instruction["type"]]: Documentation;
} = {
  move: {
    usage: "move",
    description: "Moves the owl forward.",
  },
  turn: {
    usage: "turn <direction: left_right>",
    description: `Turns the owl to the left or right based on "direction".`,
  },
  explore: {
    usage: "explore <dest: address> <direction: direction>?",
    description:
      `Checks if the owl can walk in the given "direction" or forward ` +
      `if no "direction" is given and puts the result into "dest".`,
  },
  var: [
    {
      usage: "var <name: identifier>",
      description: 'Declares a new variable named "name".',
    },
    {
      usage: "var <name: identifier>[]",
      description: 'Declares a new array named "name".',
    },
  ],
  load: {
    usage: "load <dest: address> <immediate: value>",
    description: 'Loads the given immediate value into "dest".',
  },
  copy: {
    usage: "copy <dest: address> <src: address>",
    description: 'Copies the value at address "src" and puts it into "dest".',
  },
  print: {
    usage: "print <src: address>",
    description: `Outputs the value stored in the address "src" to the console.`,
  },
  printascii: {
    usage: "printascii <src: address>",
    description: `Outputs the value stored in the address "src" as an ASCII character to the console.`,
  },
  debug: {
    usage: "debug <src: address>",
    description: `Outputs a detailed representation and type of the value stored in the address "src" to the console.`,
  },
  not: {
    usage: "not <dest: address> <src: address>",
    description: 'Inverts the bits "src" and puts the result into "dest".',
  },
  exit: {
    usage: "exit",
    description: "Stops execution and exits the program.",
  },
  // Control Flow
  branch: {
    usage: "branch <cond: address> <target: label>",
    description: `Jumps to the label "target" only if "cond" has an integer value other than 0.`,
  },
  branchz: {
    usage: "branch <cond: address> <target: label>",
    description: `Jumps to the label "target" only if "cond" has the value 0.`,
  },
  jump: {
    usage: "jump <target: label>",
    description: `Jumps to the label "target" unconditionally.`,
  },
  // TODO: Maybe explain call and ret differently.
  call: {
    usage: "call <target: label>",
    description: `Jumps to the label "target" unconditionally and creates a new stack frame.`,
  },
  ret: {
    usage: "ret",
    description: `Returns to the line after the last executed "call" instruction and to the previous stack frame.`,
  },
  mark: {
    usage: "mark <direction: direction>?",
    description: `Marks the "direction" at the tile the owl is currently in or all directions if no "direction" is given.`,
  },
  unmark: {
    usage: "unmark <direction: direction>?",
    description: `Unmarks the "direction" at the tile the owl is currently in or all directions if no "direction" is given.`,
  },
  getmark: {
    usage: "getmark <dest: address>",
    description: `Stores the mark representation of the current tile of the owl into "dest".`,
  },
  getdir: {
    usage: "getdir <dest: address>",
    description: `Gets the current direction of the owl and puts it into "dest".`,
  },

  // Arithmetic and comparison
  add: arithmetic("add", "Adds"),
  sub: arithmetic("sub", "Subtracts"),
  mul: arithmetic("mul", "Multiplies"),
  div: arithmetic("div", "Divides"),
  and: arithmetic("and", "Bitwise ANDs"),
  or: arithmetic("or", "Bitwise ORs"),
  xor: arithmetic("xor", "Bitwise XORs"),
  sll: arithmetic("sll", "Shifts left (logical)"),
  srl: arithmetic("srl", "Shifts right (logical)"),
  sra: arithmetic("sra", "Shifts right (arithmetic)"),
  lt: comparison("lt", "less than"),
  lte: comparison("lte", "less than or equal to"),
  gt: comparison("gt", "greater than"),
  gte: comparison("gte", "greater than or equal to"),
  eq: comparison("eq", "equal to"),
  neq: comparison("neq", "not equal to"),
};

function arithmetic(instruction: string, action: string): Documentation {
  return {
    usage: `${instruction} <dest: address> <src1: address> <src2: address | integer>`,
    description: `${action} "src1" and "src2" and puts the result into "dest".`,
  };
}

function comparison(instruction: string, relation: string): Documentation {
  return {
    usage: `${instruction} <dest: address> <src1: address> <src2: address | integer>`,
    description: `Checks if "src1" is ${relation} "src2" and puts the result into "dest".`,
  };
}
