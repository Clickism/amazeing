import type { Instruction } from "../interpreter/instruction.ts";

type Documentation = {
  usage: string;
  warning?: string;
  description: string;
};

type Documentations = {
  // TODO: Remove optionality
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
  neq: "not equal to"
}

export const INSTRUCTION_DOCUMENTATIONS: Documentations = {
  var: {
    usage: "var <name: identifier>\nvar <name: identifier>[]",
    description: 'Declares a new variable or array (if "[]" is present) named "name".'
  },
  load: {
    usage: "load <dest: address> <immediate: value>",
    description: 'Loads the given immediate value into "dest".'
  },
  copy: {
    usage: "copy <dest: address> <src: address>",
    description: 'Copies the value at address "src" and puts it into "dest".',
  },
  print: {
    usage: "print <src: address>",
    description: "Outputs the value of an address to the console.",
  },
  not: {
    usage: "not <dest: address> <src: address>",
    description: 'Inverts "src" and puts the result into "dest".',
  },
  // Arithmetic
  ...Object.fromEntries(
    Object.entries(arithmeticActions).map(([instr, action]) => [
      instr,
      arithmetic(instr, action),
    ])
  ),
  // Comparison
  ...Object.fromEntries(
    Object.entries(comparisonRelations).map(([instr, relation]) => [
      instr,
      comparison(instr, relation),
    ])
  ),
};

function arithmetic(instruction: string, action: string): Documentation {
  return {
    usage: `${instruction} <dest: address> <src1: address> <src2: address | integer>`,
    description: `${action} "src1" and "src2" and puts the result into dest.`,
  };
}

function comparison(instruction: string, relation: string): Documentation {
  return {
    usage: `${instruction} <dest: address> <src1: address> <src2: address | integer>`,
    description: `Checks if "src1" is ${relation} "src2" and puts the result into dest.`,
  };
}
