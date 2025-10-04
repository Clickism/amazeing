import type { Instruction, InstructionData, LabelDefinition, ThreeVarInstruction, Value } from "./instruction.ts";
import { parse } from "./parser.ts";
import { LocatableError } from "./error.ts";

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

type Executor<T extends Instruction["type"]> = (
  env: Environment,
  instruction: Extract<Instruction, { type: T }>,
) => PcTarget | undefined;

type Executors = {
  // TODO: Remove optionality once all executors are implemented
  [K in Instruction["type"]]?: Executor<K>;
};

const executors = {
  var: (env, { name }) => {
    env.set(name);
  },

  load: (env, { dest, value }) => {
    if (!env.has(dest)) {
      throw new Error(`Variable "${dest}" is not defined`);
    }
    env.set(dest, value);
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

  print: (env, { src }) => {
    const value = env.get(src);
    if (value === undefined) {
      throw new Error(`Variable "${src}" is not defined`);
    }
    if (value === null) {
      throw new Error(`Variable "${src}" is not set`);
    }
    env.console.log({ type: "log", message: value.toString() });
  },

  jump: (env, { target }) => {
    const labelPc = env.labels.get(target)?.pc;
    if (labelPc === undefined) {
      throw new Error(`Label "${target}" not found`);
    }
    return { type: "jump", target: labelPc };
  },

  call: (env, { target }) => {
    const labelPc = env.labels.get(target)?.pc;
    if (labelPc === undefined) {
      throw new Error(`Label "${target}" not found`);
    }
    return { type: "call", target: labelPc };
  },

  ret: (env) => {
    const frame = env.popStackFrame();
    if (!frame || frame.returnAddress === undefined) {
      throw new Error("No stack frame to return to");
    }
    return { type: "jump", target: frame.returnAddress };
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
  env.set(dest, result);
}

export type VariableMap = Map<string, Value | null>;

export type StackFrame = {
  returnAddress: number | undefined;
  variables: VariableMap;
};

type PcTarget = {
  type: "call" | "jump";
  target: number;
};

/**
 * Environment for the interpreter.
 */
class Environment {
  labels: Map<string, LabelDefinition>;
  console: InterpreterConsole;
  private global: VariableMap;
  private stack: StackFrame[];
  private args: VariableMap;

  constructor(
    labels: Map<string, LabelDefinition>,
    interpreterConsole: InterpreterConsole = new InterpreterConsole((msg) =>
      console.log(`[${msg.type.toUpperCase()}] ${msg.message}`),
    ),
    global: VariableMap = new Map(),
    stack: StackFrame[] = [],
    args: VariableMap = new Map(),
  ) {
    this.labels = labels;
    this.console = interpreterConsole;
    this.global = global;
    this.stack = stack;
    this.args = args;
  }

  /**
   * Gets the value of a variable.
   */
  get(name: string): Value | null | undefined {
    if (this.stack.length > 0) {
      const { variables } = this.stack[this.stack.length - 1];
      if (variables.has(name)) {
        return variables.get(name);
      }
    }
    if (this.args.has(name)) {
      return this.args.get(name);
    }
    return this.global.get(name);
  }

  /**
   * Gets the value of a variable or null if it's not defined.
   * @param name The name of the variable.
   */
  getOrNull(name: string): Value | null {
    const value = this.get(name);
    if (value === undefined) {
      throw new Error(`Variable "${name}" is not defined.`);
    }
    return value;
  }

  /**
   * Gets the value of a variable or throws an error if it's not defined or not set.
   * @param name The name of the variable.
   */
  getOrThrow(name: string): Value {
    const value = this.getOrNull(name);
    if (value === null) {
      throw new Error(`Variable "${name}" is not set.`);
    }
    return value;
  }

  /**
   * Sets the value of a variable in the current scope.
   * @throws {Error} if the variable is already defined in the current scope.
   */
  set(name: string, value: Value | null = null, isGlobal = false) {
    if (isGlobal) {
      throw new Error("Global variables not implemented yet.");
    }
    if (this.stack.length === 0) {
      this.stack.push({ returnAddress: undefined, variables: new Map() });
    }
    if (this.stack.length > 0) {
      const { variables } = this.stack[this.stack.length - 1];
      // Be lenient when re-defining variables
      // if (variables.has(name) && value === null) {
      //   throw new Error(
      //     `Variable "${name}" is already defined in the current scope.`,
      //   );
      // }
      variables.set(name, value);
    }
  }

  /**
   * Checks if a variable is defined in any scope.
   * @param name The name of the variable.
   */
  has(name: string): boolean {
    return this.get(name) !== undefined;
  }

  /**
   * Pushes a new stack frame.
   * @param returnAddress The return address for the new stack frame.
   */
  pushStackFrame(returnAddress: number) {
    this.stack.push({ returnAddress, variables: new Map() });
  }

  /**
   * Pops the top stack frame.
   */
  popStackFrame(): StackFrame | undefined {
    return this.stack.pop();
  }
}

export type ConsoleMessage = {
  type: "log" | "error" | "warn";
  message: string;
};

export class InterpreterConsole {
  logger: (message: ConsoleMessage) => void;

  constructor(logger: (message: ConsoleMessage) => void) {
    this.logger = logger;
  }

  log(message: ConsoleMessage) {
    this.logger(message);
  }
}
