import type { LeftRight, Value } from "./types.ts";

export type NoVarInstruction<T> = { type: T };
export type OneVarInstruction<T> = {
  type: T;
  src: string;
};
export type TwoVarInstruction<T> = {
  type: T;
  dest: string;
  src: string;
};
export type ThreeVarInstruction<T> = {
  type: T;
  dest: string;
  src1: string;
  src2: string;
};
export type ThreeVarIntermediateInstruction<T> = {
  type: T;
  dest: string;
  src1: string;
  src2: string | number;
};

export type Instruction =
  | NoVarInstruction<"move">
  | { type: "turn"; direction: LeftRight }
  // Variable instructions
  | { type: "var"; name: string }
  | { type: "load"; dest: string; value: Value }
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
]
