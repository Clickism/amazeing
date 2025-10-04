export type NoVarInstruction<T> = { type: T };
export type OneVarInstruction<T> = {
  type: T;
  src: string;
}
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

export type Instruction =
  | NoVarInstruction<"move">
  | { type: "turn"; direction: LeftRight }
  // Variable instructions
  | { type: "var"; name: string }
  | { type: "load"; dest: string; value: Value }
  | TwoVarInstruction<"copy">
  // Arithmetic instructions
  | ThreeVarInstruction<"add" | "sub" | "mul" | "div">
  // Logical instructions
  | ThreeVarInstruction<"and" | "or" | "xor">
  | TwoVarInstruction<"not">
  // Comparison instructions
  | ThreeVarInstruction<"lt" | "lte" | "gt" | "gte" | "eq" | "neq">
  // Control flow instructions
  | { type: "jump"; target: number }
  | { type: "call"; target: number }
  | NoVarInstruction<"ret">
  | { type: "branch"; cond: string; target: number }
  | { type: "branchz"; cond: string; target: number }
  // Other instructions
  | OneVarInstruction<"print">;

export type LeftRight = "left" | "right";

export type InstructionData = {
  instruction: Instruction;
  line: number;
};

export type Value = number;
export type LabelDefinition = { label: string; line: number };
