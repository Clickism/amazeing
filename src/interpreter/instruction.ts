import type {
  Address,
  Direction,
  LeftRight,
  Value,
  Variable,
} from "./types.ts";

export type NoVarInstruction<T> = { type: T };
export type OneVarInstruction<T> = {
  type: T;
  src: Address;
};
export type TwoVarInstruction<T> = {
  type: T;
  dest: Address;
  src: Address;
};
export type ThreeVarInstruction<T> = {
  type: T;
  dest: Address;
  src1: Address;
  src2: Address;
};
export type ThreeVarIntermediateInstruction<T> = {
  type: T;
  dest: Address;
  src1: Address;
  src2: Address | number;
};

export type Instruction =
  | NoVarInstruction<"move">
  | { type: "turn"; direction: LeftRight }
  | { type: "explore"; dest: Address; direction?: Direction }
  // Variable instructions
  | { type: "var"; name: Variable; isArray: boolean }
  | { type: "load"; dest: Address; value: Value }
  | TwoVarInstruction<"copy">
  // Arithmetic instructions
  | ThreeVarIntermediateInstruction<"add">
  | ThreeVarIntermediateInstruction<"sub">
  | ThreeVarIntermediateInstruction<"mul">
  | ThreeVarIntermediateInstruction<"div">
  // Logical instructions
  | ThreeVarIntermediateInstruction<"and">
  | ThreeVarIntermediateInstruction<"or">
  | ThreeVarIntermediateInstruction<"xor">
  | TwoVarInstruction<"not">
  // Comparison instructions
  | ThreeVarIntermediateInstruction<"lt">
  | ThreeVarIntermediateInstruction<"lte">
  | ThreeVarIntermediateInstruction<"gt">
  | ThreeVarIntermediateInstruction<"gte">
  | ThreeVarIntermediateInstruction<"eq">
  | ThreeVarIntermediateInstruction<"neq">
  // Shifting instructions
  | ThreeVarIntermediateInstruction<"sll">
  | ThreeVarIntermediateInstruction<"srl">
  | ThreeVarIntermediateInstruction<"sra">
  // Control flow instructions
  | { type: "jump"; target: string }
  | { type: "call"; target: string }
  | NoVarInstruction<"ret">
  | NoVarInstruction<"exit">
  | { type: "branch"; cond: string; target: string }
  | { type: "branchz"; cond: string; target: string }
  // Other instructions
  | OneVarInstruction<"print">
  | OneVarInstruction<"debug">;

export type InstructionData = {
  instruction: Instruction;
  line: number;
};

export type LabelDefinition = { label: string; pc: number };

export const ALL_INSTRUCTIONS = [
  "move",
  "turn",
  "explore",
  "var",
  "load",
  "copy",
  "add",
  "sub",
  "mul",
  "div",
  "and",
  "or",
  "xor",
  "not",
  "lt",
  "lte",
  "gt",
  "gte",
  "eq",
  "neq",
  "sll",
  "srl",
  "sra",
  "jump",
  "call",
  "ret",
  "exit",
  "branch",
  "branchz",
  "print",
  "debug",
];

export const ALL_CONSTANTS = [
  "north",
  "east",
  "south",
  "west",
  "left",
  "right",
  "here",
  "front",
  "back",
];
