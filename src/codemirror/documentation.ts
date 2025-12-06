import type { Instruction } from "../interpreter/instruction.ts";

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

type Documentations = {
  [K in Instruction["type"]]?: Documentation;
};

const arithmeticActions = {
  add: "Adds",
  sub: "Subtracts",
  mul: "Multiplies",
  div: "Divides",
  and: "Bitwise ANDs",
  or: "Bitwise ORs",
  xor: "Bitwise XORs",
  sll: "Shifts left (logical)",
  srl: "Shifts right (logical)",
  sra: "Shifts right (arithmetic)",
};

const comparisonRelations = {
  lt: "less than",
  gt: "greater than",
  lte: "less than or equal to",
  gte: "greater than or equal to",
  eq: "equal to",
  neq: "not equal to",
};

export const INSTRUCTION_DOCUMENTATIONS: Documentations = {
  move: {
    usage: "move",
    description: "Moves the owl forward.",
  },
  turn: {
    usage: "turn <direction: left_right>",
    description: `Turns the owl to the left or right based on "direction".`,
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
  // Arithmetic
  ...Object.fromEntries(
    Object.entries(arithmeticActions).map(([instr, action]) => [
      instr,
      arithmetic(instr, action),
    ]),
  ),
  // Comparison
  ...Object.fromEntries(
    Object.entries(comparisonRelations).map(([instr, relation]) => [
      instr,
      comparison(instr, relation),
    ]),
  ),
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
