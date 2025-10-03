import type { InstructionData, Value } from "./instruction.ts";
import { parse } from "./parser.ts";

/**
 * Interpreter for Amazeing.
 */
export class Interpreter {
  pc: number;
  instructions: InstructionData[];
  env: Map<string, Value>;

  constructor(
    instructions: InstructionData[],
    env: Map<string, Value> = new Map(),
  ) {
    this.pc = 0;
    this.instructions = instructions;
    this.env = env;
  }

  static fromCode(code: string): Interpreter {
    return new Interpreter(parse(code));
  }

  step() {
    if (this.pc >= this.instructions.length) {
      throw new Error("Program has already terminated");
    }
    const { instruction, line } = this.instructions[this.pc];
    // For now, we just log the instruction and increment the pc
    console.log(`Executing line ${line}:`, JSON.stringify(instruction));
    this.pc++;
  }

  run() {
    while (this.pc < this.instructions.length) {
      this.step();
    }
  }
}
