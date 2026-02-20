import type { InstructionData } from "./instruction.ts";
import { parse } from "./parser.ts";
import { ErrorWithTip, LocatableError } from "./error.ts";
import { Environment } from "./environment.ts";
import { type InterpreterConsole } from "./console.ts";
import { EXECUTORS } from "./executor.ts";
import { Owl } from "../game/owl.ts";
import type { Level } from "../game/level.ts";

const MAX_STEPS = 10000;

export type PcTarget = {
  type: "call" | "jump";
  target: number;
};

/**
 * Abstract interpreter class for Amazeing (OwlASM?).
 */
export abstract class Interpreter {
  /**
   * Executes the next instruction.
   *
   * @throws {Error} If the program has already terminated.
   * @throws {LocatableError} If an error occurs during execution.
   */
  abstract step(): void;

  /**
   * Executes the next multiple instructions.
   *
   * @throws {Error} If the program has already terminated.
   * @throws {LocatableError} If an error occurs during execution.
   * @param steps The number of steps to execute.
   */
  abstract stepMultiple(steps: number): void;

  /**
   * Runs the rest of the program until termination.
   * Blocking.
   */
  abstract run(): void;

  /**
   * Returns true if there are more instructions to execute.
   */
  abstract canStep(): boolean;

  /**
   * Returns the current line number, or:
   *
   * <code>-1</code> if the program has terminated.
   *
   * <code>null</code> if the program has not started yet.
   */
  abstract getCurrentLine(): number | null;

  /**
   * Returns the current console.
   */
  abstract getConsole(): InterpreterConsole;

  /**
   * Checks if the level is finished and prints a success message if it is.
   */
  abstract checkFinish(): boolean;

  /**
   * Executes and catches errors thrown by the given function
   * and prints them to the console.
   *
   * @param fn The function to execute.
   */
  executeAndPrintError(fn: (interpreter: Interpreter) => void) {
    try {
      fn(this);
    } catch (e) {
      if (e instanceof Error) {
        const console = this.getConsole();
        console.log({ type: "error", text: e.message });
        if (e instanceof ErrorWithTip && e.tip !== null) {
          console.log({ type: "info", text: "Tip: " + e.tip });
        }
      }
    }
  }
}

/**
 * Interpreter for Amazeing.
 */
export class InterpreterImpl extends Interpreter {
  pc: number;
  instructions: InstructionData[];
  env: Environment;
  steps: number = 0;
  /**
   * Whether the interpreter is locked due to an error or
   * completing the level.
   */
  isLocked: boolean = false;
  isFinished: boolean = false;
  onFinish?: () => void;

  constructor(
    instructions: InstructionData[],
    env: Environment,
    onFinish?: () => void,
  ) {
    super();
    this.pc = 0;
    this.instructions = instructions;
    this.env = env;
    this.onFinish = onFinish;
  }

  /**
   * Parses the given code and returns a new Interpreter instance.
   * @param code The code to parse.
   * @param interpreterConsole The console to use for logging.
   * @param owl The owl instance.
   * @param level The level.
   * @param onFinish Optional callback to call when the level is finished.
   */
  static fromCode(
    code: string,
    interpreterConsole: InterpreterConsole,
    owl: Owl,
    level: Level,
    onFinish?: () => void,
  ): Interpreter {
    const { instructions, labels } = parse(code);
    return new InterpreterImpl(
      instructions,
      new Environment(labels, interpreterConsole, owl, level),
      onFinish,
    );
  }

  step() {
    try {
      this.executeStep();
    } catch (e) {
      this.isLocked = true;
      throw e;
    }
  }

  stepMultiple(steps: number) {
    for (let i = 0; i < steps; i++) {
      if (!this.canStep()) break;
      this.step();
    }
  }

  run() {
    while (this.canStep()) {
      this.step();
    }
  }

  canStep(): boolean {
    return this.pc < this.instructions.length && !this.isLocked;
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

  getConsole(): InterpreterConsole {
    return this.env.console;
  }

  private executeStep() {
    if (this.steps >= MAX_STEPS) {
      throw new ErrorWithTip(
        "Maximum number of steps exceeded: " + MAX_STEPS,
        "There might be an infinite loop in your program.",
      );
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
      if (target === -1) {
        // Terminate program on exit
        this.pc = this.instructions.length;
        return;
      }
      this.pc = target;
    } else {
      // Increment pc by one
      this.pc++;
    }
    this.steps++;
    // Check for level completion
    this.checkFinish();
  }

  checkFinish() {
    if (this.isFinished) return true;
    if (this.env.level.isOwlAtFinish(this.env.owl.data())) {
      this.env.console.log({ type: "success", text: "Level completed!" });
      this.isLocked = true;
      this.isFinished = true;
      this.onFinish?.();
      return true;
    }
    return false;
  }

  /**
   * Executes a single instruction.
   * @param instruction The instruction to execute.
   * @param line The line number of the instruction.
   * @throws {LocatableError} If an error occurs during execution.
   */
  private executeInstruction({ instruction, line }: InstructionData) {
    const executor = EXECUTORS[instruction.type];
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
        const tip = err instanceof ErrorWithTip ? err.tip : null;
        throw new LocatableError(line, err.message, tip);
      }
    }
  }
}

/**
 * Lazy interpreter for Amazeing.
 * Will only parse the code when needed.
 */
export class LazyInterpreter extends Interpreter {
  code: string;
  console: InterpreterConsole;
  owl: Owl;
  level: Level;
  interpreter: Interpreter | null = null;
  hasError: boolean = false;
  onFinish?: () => void;

  private constructor(
    code: string,
    console: InterpreterConsole,
    owl: Owl,
    level: Level,
    onFinish?: () => void,
  ) {
    super();
    this.code = code;
    this.console = console;
    this.owl = owl;
    this.level = level;
    this.onFinish = onFinish;
  }

  /**
   * Creates a new lazily initialized Interpreter from the given code and console.
   * @param code The code to interpret.
   * @param console The console to use for logging.
   * @param owl The owl instance.
   * @param level The level.
   * @param onFinish Optional callback to call when the level is finished.
   */
  static fromCode(
    code: string,
    console: InterpreterConsole,
    owl: Owl,
    level: Level,
    onFinish?: () => void,
  ): LazyInterpreter {
    return new LazyInterpreter(code, console, owl, level, onFinish);
  }

  init() {
    if (this.interpreter !== null) return;
    if (this.hasError) return;
    try {
      this.interpreter = InterpreterImpl.fromCode(
        this.code,
        this.console,
        this.owl,
        this.level,
        this.onFinish,
      );
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
      const codeLines = this.code
        .split("\n")
        .filter((l) => l !== "" && !l.startsWith("#")).length;
      return codeLines > 0;
    } else {
      return this.interpreter.canStep();
    }
  }

  getCurrentLine(): number | null {
    return this.interpreter?.getCurrentLine() ?? null;
  }

  getConsole(): InterpreterConsole {
    return this.console;
  }

  checkFinish(): boolean {
    this.init();
    return this.interpreter?.checkFinish() ?? false;
  }
}
