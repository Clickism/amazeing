import type {
  Address,
  Direction,
  Integer,
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
  src2: Address | Integer;
};
export type ThreeVarGenericInstruction<T> = {
  type: T;
  dest: Address;
  src1: Address;
  src2: Address | Value;
};

// TODO: Also maybe new instruction "printm" that takes different printing modes, ascii or sth?? or just "printascii"
export type Instruction =
  | NoVarInstruction<"move">
  | { type: "turn"; direction: LeftRight }
  | { type: "explore"; dest: Address; direction?: Direction }
  // Variable instructions
  | { type: "var"; name: Variable; isArray: boolean }
  | { type: "load"; dest: Address; value: Value }
  | TwoVarInstruction<"copy">
  // Arithmetic instructions
  | ThreeVarInstruction<"add">
  | ThreeVarInstruction<"sub">
  | ThreeVarInstruction<"mul">
  | ThreeVarInstruction<"div">
  // Logical instructions
  | ThreeVarInstruction<"and">
  | ThreeVarInstruction<"or">
  | ThreeVarInstruction<"xor">
  | TwoVarInstruction<"not">
  // Comparison instructions
  | ThreeVarInstruction<"lt">
  | ThreeVarInstruction<"lte">
  | ThreeVarInstruction<"gt">
  | ThreeVarInstruction<"gte">
  | ThreeVarGenericInstruction<"eq">
  | ThreeVarGenericInstruction<"neq">
  // Shifting instructions
  | ThreeVarInstruction<"sll">
  | ThreeVarInstruction<"srl">
  | ThreeVarInstruction<"sra">
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
