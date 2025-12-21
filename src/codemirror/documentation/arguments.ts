import type { Instruction } from "../../interpreter/instruction.ts";

export type ArgumentType =
  | "address"
  | "variable"
  | "integer"
  | "label"
  | "identifier"
  | DirectionType;

export type DirectionType =
  | "direction"
  | "cardinal_direction"
  | "relative_direction"
  | "left_right";

export type Argument = {
  types: ArgumentType[];
};

export type Arguments = Argument[];

type ArgumentLookup = {
  [K in Instruction["type"]]?: Arguments;
};

const THREE_VAR_ARGS: Arguments = [
  { types: ["address"] },
  { types: ["address"] },
  { types: ["address", "integer"] },
];

const TWO_VAR_ARGS: Arguments = [
  { types: ["address"] },
  { types: ["address"] },
];

/**
 * Gets the argument types for a given instruction.
 * @param instruction The instruction type.
 */
export function getInstructionArguments(instruction: string): Arguments | null {
  return (
    INSTRUCTION_ARGUMENT_LOOKUP[instruction as Instruction["type"]] ?? null
  );
}

const INSTRUCTION_ARGUMENT_LOOKUP: ArgumentLookup = {
  move: [],
  turn: [{ types: ["left_right"] }],
  explore: [{ types: ["address"] }, { types: ["direction"] }],

  var: [{ types: ["identifier"] }],
  load: [{ types: ["address"] }, { types: ["integer", "direction"] }],
  copy: TWO_VAR_ARGS,

  add: THREE_VAR_ARGS,
  sub: THREE_VAR_ARGS,
  mul: THREE_VAR_ARGS,
  div: THREE_VAR_ARGS,

  and: THREE_VAR_ARGS,
  or: THREE_VAR_ARGS,
  xor: THREE_VAR_ARGS,
  not: TWO_VAR_ARGS,

  lt: THREE_VAR_ARGS,
  lte: THREE_VAR_ARGS,
  gt: THREE_VAR_ARGS,
  gte: THREE_VAR_ARGS,
  eq: THREE_VAR_ARGS,
  neq: THREE_VAR_ARGS,

  sll: THREE_VAR_ARGS,
  srl: THREE_VAR_ARGS,
  sra: THREE_VAR_ARGS,

  jump: [{ types: ["label"] }],
  call: [{ types: ["label"] }],
  ret: [],
  exit: [],
  branch: [{ types: ["address"] }, { types: ["label"] }],
  branchz: [{ types: ["address"] }, { types: ["label"] }],

  print: [{ types: ["address"] }],
  debug: [{ types: ["address"] }],
};
