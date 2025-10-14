import type {
  Instruction,
  InstructionData,
  ThreeVarInstruction,
} from "./instruction.ts";
import { parse } from "./parser.ts";
import { LocatableError } from "./error.ts";
import { Environment } from "./environment.ts";
import type { InterpreterConsole } from "./console.ts";

const MAX_STEPS = 10000;

/**
 * Interpreter interface for Amazeing (OwlASM?).
 */
export interface Interpreter {
  /**
   * Executes the next instruction.
   *
   * @throws {Error} If the program has already terminated.
   * @throws {LocatableError} If an error occurs during execution.
   */
  step(): void;

  /**
   * Executes the next multiple instructions.
   *
   * @throws {Error} If the program has already terminated.
   * @throws {LocatableError} If an error occurs during execution.
   * @param steps The number of steps to execute.
   */
  stepMultiple(steps: number): void;

  /**
   * Runs the rest of the program until termination.
   * Blocking.
   */
  run(): void;

  /**
   * Returns true if there are more instructions to execute.
   */
  canStep(): boolean;

  /**
   * Returns the current line number, or:
   *
   * <code>-1</code> if the program has terminated.
   *
   * <code>null</code> if the program has not started yet.
   */
  getCurrentLine(): number | null;
}

/**
 * Interpreter for Amazeing.
 */
export class InterpreterImpl implements Interpreter {
  pc: number;
  instructions: InstructionData[];
  env: Environment;
  steps: number = 0;
  hasError: boolean = false;

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
    interpreterConsole: InterpreterConsole,
  ): Interpreter {
    const { instructions, labels } = parse(code);
    return new InterpreterImpl(
      instructions,
      new Environment(labels, interpreterConsole),
    );
  }

  step() {
    try {
      this.executeStep();
    } catch (e) {
      this.hasError = true;
      throw e;
    }
  }

  private executeStep() {
    if (this.steps >= MAX_STEPS) {
      throw new Error("Maximum number of steps exceeded: " + MAX_STEPS);
    }
    if (this.pc >= this.instructions.length) {
      throw new Error("No more instructions to execute.");
    }
    const { instruction, line } = this.instructions[this.pc];
    // For now, we just log the instruction and increment the pc
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

  stepMultiple(steps: number) {
    for (let i = 0; i < steps; i++) {
      if (!this.canStep()) break;
      this.step();
    }
  }

  run() {
    while (this.pc < this.instructions.length) {
      this.step();
    }
  }

  canStep(): boolean {
    return this.pc < this.instructions.length && !this.hasError;
  }

  /**
   * Executes a single instruction.
   * @param instruction The instruction to execute.
   * @param line The line number of the instruction.
   * @throws {LocatableError} If an error occurs during execution.
   */
  private executeInstruction({ instruction, line }: InstructionData) {
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

  getCurrentLine(): number | null {
    if (this.pc === 0) {
      return null;
    }
    if (this.pc >= this.instructions.length) {
      return -1;
    }
    return this.instructions[this.pc].line;
  }
}

/**
 * Lazy interpreter for Amazeing.
 * Will only parse the code when needed.
 */
export class LazyInterpreter implements Interpreter {
  code: string;
  console: InterpreterConsole;
  interpreter: Interpreter | null = null;
  hasError: boolean = false;

  private constructor(code: string, console: InterpreterConsole) {
    this.code = code;
    this.console = console;
  }

  /**
   * Creates a new lazily initialized Interpreter from the given code and console.
   * @param code The code to interpret.
   * @param console The console to use for logging.
   */
  static fromCode(code: string, console: InterpreterConsole): LazyInterpreter {
    return new LazyInterpreter(code, console);
  }

  init() {
    if (this.interpreter !== null) return;
    if (this.hasError) return;
    try {
      this.interpreter = InterpreterImpl.fromCode(this.code, this.console);
    } catch (e) {
      this.hasError = true;
      throw e;
    }
  }

  step() {
    this.init();
    this.interpreter?.step();
  }

  stepMultiple(steps: number) {
    this.init();
    this.interpreter?.stepMultiple(steps);
  }

  run() {
    this.init();
    this.interpreter?.run();
  }

  canStep(): boolean {
    if (this.hasError) return false;
    if (this.interpreter === null) {
      // If not initialized, check if there is code to run
      return this.code.trim().length > 0;
    } else {
      return this.interpreter.canStep();
    }
  }

  getCurrentLine(): number | null {
    return this.interpreter?.getCurrentLine() ?? null;
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
  move: () => {
    throw new Error("Not implemented");
  },

  turn: () => {
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

  lt: (env, instruction) => logicalExecutor(env, instruction, (a, b) => a < b),
  lte: (env, instruction) =>
    logicalExecutor(env, instruction, (a, b) => a <= b),
  gt: (env, instruction) => logicalExecutor(env, instruction, (a, b) => a > b),
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

/**
 * Executes an arithmetic operation.
 */
function arithmeticExecutor(
  env: Environment,
  instruction: ThreeVarInstruction<unknown>,
  operation: (a: number, b: number) => number,
) {
  const { dest, src1, src2 } = instruction;
  const val1 = env.getOrThrow(src1);
  const val2 = env.getOrThrow(src2);
  const result = operation(val1, val2);
  env.setOrThrow(dest, result);
}

/**
 * Executes a logical operation, storing 1 for true and 0 for false.
 */
function logicalExecutor(
  env: Environment,
  instruction: ThreeVarInstruction<unknown>,
  cond: (a: number, b: number) => boolean,
) {
  return arithmeticExecutor(env, instruction, (a, b) => (cond(a, b) ? 1 : 0));
}
