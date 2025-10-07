import type { Instruction, InstructionData, ThreeVarInstruction, Value } from "./instruction.ts";
import { parse } from "./parser.ts";
import { LocatableError } from "./error.ts";
import { Environment } from "./environment.ts";
import type { InterpreterConsole } from "./console.ts";

const MAX_STEPS = 10000;

/**
 * Interpreter for Amazeing.
 */
export class Interpreter {
  pc: number;
  instructions: InstructionData[];
  env: Environment;
  steps: number = 0;

  constructor(instructions: InstructionData[], env: Environment) {
    this.pc = 0;
    this.instructions = instructions;
    this.env = env;
  }

  /**
   * Parses the given code and returns a new Interpreter instance.
   * @param code The code to parse.
   * @param interpreterConsole The console to use for logging.
   */
  static fromCode(
    code: string,
    interpreterConsole?: InterpreterConsole,
  ): Interpreter {
    const { instructions, labels } = parse(code);
    return new Interpreter(
      instructions,
      new Environment(labels, interpreterConsole),
    );
  }

  /**
   * Executes the next instruction.
   *
   * @throws {Error} If the program has already terminated.
   * @throws {LocatableError} If an error occurs during execution.
   */
  step() {
    if (this.steps >= MAX_STEPS) {
      throw new Error("Maximum number of steps exceeded.");
    }
    if (this.pc >= this.instructions.length) {
      throw new Error("No more instructions to execute.");
    }
    const { instruction, line } = this.instructions[this.pc];
    // For now, we just log the instruction and increment the pc
    console.log(`Executing line ${line}:`, JSON.stringify(instruction));
    const pcTarget = this.executeInstruction({ instruction, line });
    if (pcTarget) {
      const { target, type } = pcTarget;
      if (type === "call") {
        // Push a new stack frame
        this.env.pushStackFrame(this.pc + 1);
      }
      this.pc = target;
    } else {
      // Increment pc by one
      this.pc++;
    }
    this.steps++;
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

  /**
   * Executes a single instruction.
   * @param instruction The instruction to execute.
   * @param line The line number of the instruction.
   * @throws {LocatableError} If an error occurs during execution.
   */
  executeInstruction({ instruction, line }: InstructionData) {
    const executor = executors[instruction.type];
    if (!executor) {
      throw new LocatableError(
        line,
        `No executor found for instruction type "${instruction.type}"`,
      );
    }
    try {
      return executor(this.env, instruction as never);
    } catch (err) {
      if (err instanceof Error) {
        throw new LocatableError(line, err.message);
      }
    }
  }

  /**
   * Returns the current line number, or null.
   */
  getCurrentLine(): number | null {
    if (this.pc >= this.instructions.length) {
      return null;
    }
    return this.instructions[this.pc].line;
  }
}

type PcTarget = {
  type: "call" | "jump";
  target: number;
};

type Executor<T extends Instruction["type"]> = (
  env: Environment,
  instruction: Extract<Instruction, { type: T }>,
) => PcTarget | undefined;

type Executors = {
  [K in Instruction["type"]]: Executor<K>;
};

const executors = {
  move: (env) => {
    throw new Error("Not implemented");
  },

  turn: (env, { direction }) => {
    throw new Error("Not implemented");
  },

  var: (env, { name }) => {
    env.define(name);
  },

  load: (env, { dest, value }) => {
    env.setOrThrow(dest, value);
  },

  copy: (env, { dest, src }) => {
    const value = env.getOrThrow(src);
    env.setOrThrow(dest, value);
  },

  add: (env, instruction) =>
    arithmeticExecutor(env, instruction, (a, b) => a + b),
  sub: (env, instruction) =>
    arithmeticExecutor(env, instruction, (a, b) => a - b),
  mul: (env, instruction) =>
    arithmeticExecutor(env, instruction, (a, b) => a * b),
  div: (env, instruction) =>
    arithmeticExecutor(env, instruction, (a, b) => {
      if (b === 0) {
        throw new Error("Division by zero");
      }
      return Math.floor(a / b);
    }),

  and: (env, instruction) =>
    arithmeticExecutor(env, instruction, (a, b) => a & b),
  or: (env, instruction) =>
    arithmeticExecutor(env, instruction, (a, b) => a | b),
  xor: (env, instruction) =>
    arithmeticExecutor(env, instruction, (a, b) => a ^ b),
  not: (env, { dest, src }) => {
    const value = env.getOrThrow(src);
    // TODO: Bitwise not?
    env.setOrThrow(dest, ~value);
  },

  lt: (env, instruction) =>
    logicalExecutor(env, instruction, (a, b) => a < b),
  lte: (env, instruction) =>
    logicalExecutor(env, instruction, (a, b) => a <= b),
  gt: (env, instruction) =>
    logicalExecutor(env, instruction, (a, b) => a > b),
  gte: (env, instruction) =>
    logicalExecutor(env, instruction, (a, b) => a >= b),
  eq: (env, instruction) =>
    logicalExecutor(env, instruction, (a, b) => a === b),
  neq: (env, instruction) =>
    logicalExecutor(env, instruction, (a, b) => a !== b),

  jump: (env, { target }) => {
    const pc = env.getLabelOrThrow(target).pc;
    return { type: "jump", target: pc };
  },

  call: (env, { target }) => {
    const pc = env.getLabelOrThrow(target).pc;
    return { type: "call", target: pc };
  },

  ret: (env) => {
    const frame = env.popStackFrame();
    if (!frame || frame.returnAddress === undefined) {
      throw new Error("No stack frame to return to");
    }
    return { type: "jump", target: frame.returnAddress };
  },

  branch: (env, { cond, target }) => {
    const pc = env.getLabelOrThrow(target).pc;
    const condValue = env.getOrThrow(cond);
    if (condValue !== 0) {
      return { type: "jump", target: pc };
    }
  },

  branchz: (env, { cond, target }) => {
    const pc = env.getLabelOrThrow(target).pc;
    const condValue = env.getOrThrow(cond);
    if (condValue === 0) {
      return { type: "jump", target: pc };
    }
  },

  print: (env, { src }) => {
    const value = env.getOrThrow(src);
    env.console.log({ type: "log", text: value.toString() });
  },
} as Executors;

function arithmeticExecutor(
  env: Environment,
  instruction: ThreeVarInstruction<unknown>,
  operation: (a: Value, b: Value) => Value,
) {
  const { dest, src1, src2 } = instruction;
  const val1 = env.getOrThrow(src1);
  const val2 = env.getOrThrow(src2);
  const result = operation(val1, val2);
  env.setOrThrow(dest, result);
}

function logicalExecutor(
  env: Environment,
  instruction: ThreeVarInstruction<unknown>,
  cond: (a: Value, b: Value) => boolean,
) {
  return arithmeticExecutor(env, instruction, (a, b) => (cond(a, b) ? 1 : 0);
}
