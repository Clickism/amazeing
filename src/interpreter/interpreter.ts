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

  /**
   * Parses the given code and returns a new Interpreter instance.
   * @param code The code to parse.
   */
  static fromCode(code: string): Interpreter {
    return new Interpreter(parse(code));
  }

  /**
   * Executes the next instruction.
   *
   * @throws {Error} If the program has already terminated.
   * @throws {InterpreterError} If an error occurs during execution.
   */
  step() {
    if (this.pc >= this.instructions.length) {
      throw new Error("No more instructions to execute.");
    }
    const { instruction, line } = this.instructions[this.pc];
    // For now, we just log the instruction and increment the pc
    console.log(`Executing line ${line}:`, JSON.stringify(instruction));
    this.pc++;
    throw new InterpreterError(line, "Instruction execution not implemented.");
  }

  /**
   * Runs the rest of the program until termination.
   */
  run() {
    while (this.pc < this.instructions.length) {
      this.step();
    }
  }

  /**
   * Returns true if there are more instructions to execute.
   */
  canStep(): boolean {
    return this.pc < this.instructions.length;
  }
}

/**
 * Error thrown when an error occurs during interpretation.
 */
class InterpreterError extends Error {
  constructor(lineNumber: number, message: string) {
    super(`Error on line ${lineNumber}: ${message}`);
    this.name = "InterpreterError";
  }
}
