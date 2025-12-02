import type { Instruction } from "../interpreter/instruction.ts";

type Documentation = {
  usage: string;
  warning?: string;
  description: string;
};

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
};

export const INSTRUCTION_DOCUMENTATIONS: Documentations = {
  print: {
    usage: "print <src: address>",
    description: "Outputs the value of an address to the console.",
  },
  ...Object.fromEntries(
    Object.entries(arithmeticActions).map(([instr, action]) => [
      instr,
      arithmetic(instr, action),
    ])
  ),
};

function arithmetic(instruction: string, action: string): Documentation {
  return {
    usage: `${instruction} <dest: address> <src1: address> <src2: address | integer>`,
    description: `${action} src1 and src2 and puts the result into dest.`,
  };
}
