import type { InstructionData } from "./instruction.ts";
import { ErrorWithTip, LocatableError } from "./error.ts";
import { Environment } from "./environment.ts";
import { type ConsoleMessage, InterpreterConsole } from "./console.ts";
import { EXECUTORS } from "./executor.ts";
import { type OwlData } from "../game/owl.ts";
import type { Level } from "../game/level.ts";
import { emptyMarks, type MarkData } from "../game/marks.ts";
import { Lexer } from "./parser/lexer.ts";
import { Parser } from "./parser/parser.ts";

const MAX_STEPS = 20000;

export type PcTarget = {
  type: "call" | "jump";
  target: number;
};

export type InterpreterSnapshot = {
  owl: OwlData;
  marks: MarkData;
  line: number | null;
  output: readonly ConsoleMessage[];
  isFinished: boolean;
};

/**
 * Interpreter class for AmazeingASM.
 */
export class Interpreter {
  private pc: number = 0;
  private instructions: InstructionData[];
  private env: Environment;
  private steps: number = 0;
  private console: InterpreterConsole;
  /**
   * Whether the interpreter is locked due to an error or
   * completing the level.
   */
  private isLocked: boolean = false;
  private isFinished: boolean = false;

  /**
   * Callback to call when the level is finished.
   */
  onFinish?: () => void;

  /**
   * Creates a new interpreter instance
   */
  constructor(
    instructions: InstructionData[],
    env: Environment,
    console: InterpreterConsole,
  ) {
    this.instructions = instructions;
    this.env = env;
    this.console = console;
  }

  /**
   * Parses the given code and returns a new Interpreter instance.
   * @param code The code to parse.
   * @param level The level.
   *
   * @throws {Error} if parsing failed
   */
  static fromCode(code: string, level: Level): Interpreter {
    const tokens = new Lexer(code).tokenize();
    const { instructions, labels } = new Parser(tokens).parse();
    const console = new InterpreterConsole();
    return new Interpreter(
      instructions,
      new Environment(labels, console, level),
      console,
    );
  }

  /**
   * Executes the next instruction(s).
   *
   * @param steps The number of steps to execute, or 1 if not given
   */
  step(steps = 1) {
    this.catchError(() => {
      for (let i = 0; i < steps; i++) {
        if (!this.canStep()) break;
        try {
          this.executeStep();
        } catch (e) {
          this.isLocked = true;
          throw e;
        }
      }
    });
  }

  /**
   * Executes a step
   *
   * @throws {Error} if an error occurs
   */
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

  /**
   * Returns true if there are more instructions to execute.
   */
  canStep(): boolean {
    return this.pc < this.instructions.length && !this.isLocked;
  }

  /**
   * Checks if the level is finished and prints a success message if it is.
   */
  // TODO: Don't log on finish maybe?
  checkFinish() {
    if (this.isFinished) return true;
    if (this.env.level.isFinished(this.env.owl.data)) {
      this.env.console.log({ type: "success", text: "Level completed!" });
      this.isLocked = true;
      this.isFinished = true;
      this.onFinish?.();
      return true;
    } else if (!this.canStep()) {
      this.env.console.log({
        type: "system",
        text: "No more instructions left to execute.",
      });
      this.isLocked = true;
      this.isFinished = false;
    }
    return false;
  }

  /**
   * Gets the current state of the interpreter
   */
  snapshot(): InterpreterSnapshot {
    const owl = { ...this.env.owl.data };
    const marks = { marks: this.env.marks.data.marks.map((r) => [...r]) };
    return {
      owl,
      marks,
      line: this.currentLine(),
      output: [...this.console.output],
      isFinished: this.isFinished,
    };
  }

  /**
   * Executes and catches errors thrown by the given function
   * and prints them to the console.
   */
  private catchError(fn: () => void) {
    try {
      fn();
    } catch (e) {
      if (e instanceof Error) {
        this.console.log({ type: "error", text: e.message });
        if (e instanceof ErrorWithTip && e.tip !== null) {
          this.console.log({ type: "info", text: "Tip: " + e.tip });
        }
      }
    }
  }

  /**
   * Gets the current line of the interpreter
   * @return null if not started, -1 if execution is finished, line number otherwise
   */
  currentLine(): number | null {
    if (this.pc === 0) {
      return null;
    }
    if (this.pc >= this.instructions.length) {
      return -1;
    }
    return this.instructions[this.pc].line;
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
 * Creates an initial empty interpreter snapshot
 */
export function emptySnapshot(level: Level): InterpreterSnapshot {
  return {
    owl: level.createOwlData(),
    marks: emptyMarks(level.data.maze.width, level.data.maze.height),
    line: null,
    output: [],
    isFinished: false,
  };
}

// /**
//  * Lazy interpreter for Amazeing.
//  * Will only parse the code when needed.
//  */
// export class LazyInterpreter extends Interpreter {
//   code: string;
//   console: InterpreterConsole;
//   owl: Owl;
//   level: Level;
//   marks: Marks;
//   interpreter: Interpreter | null = null;
//   hasError: boolean = false;
//   onFinish?: () => void;
//
//   private constructor(
//     code: string,
//     console: InterpreterConsole,
//     owl: Owl,
//     level: Level,
//     marks: Marks,
//     onFinish?: () => void,
//   ) {
//     super();
//     this.code = code;
//     this.console = console;
//     this.owl = owl;
//     this.level = level;
//     this.marks = marks;
//     this.onFinish = onFinish;
//   }
//
//   /**
//    * Creates a new lazily initialized Interpreter from the given code and console.
//    * @param code The code to interpret.
//    * @param console The console to use for logging.
//    * @param owl The owl instance.
//    * @param level The level.
//    * @param marks The marks instance.
//    * @param onFinish Optional callback to call when the level is finished.
//    */
//   static fromCode(
//     code: string,
//     console: InterpreterConsole,
//     owl: Owl,
//     level: Level,
//     marks: Marks,
//     onFinish?: () => void,
//   ): LazyInterpreter {
//     return new LazyInterpreter(code, console, owl, level, marks, onFinish);
//   }
//
//   init() {
//     if (this.interpreter !== null) return;
//     if (this.hasError) return;
//     try {
//       this.interpreter = InterpreterImpl.fromCode(
//         this.code,
//         this.console,
//         this.owl,
//         this.level,
//         this.marks,
//         this.onFinish,
//       );
//     } catch (e) {
//       this.hasError = true;
//       throw e;
//     }
//   }
//
//   step() {
//     this.init();
//     this.interpreter?.step();
//   }
//
//   step(steps: number) {
//     this.init();
//     this.interpreter?.step(steps);
//   }
//
//   run() {
//     this.init();
//     this.interpreter?.run();
//   }
//
//   canStep(): boolean {
//     if (this.hasError) return false;
//     if (this.interpreter === null) {
//       // If not initialized, check if there is code to run
//       const codeLines = this.code
//         .split("\n")
//         .filter((l) => l !== "" && !l.startsWith("#")).length;
//       return codeLines > 0;
//     } else {
//       return this.interpreter.canStep();
//     }
//   }
//
//   getCurrentLine(): number | null {
//     return this.interpreter?.getCurrentLine() ?? null;
//   }
//
//   getConsole(): InterpreterConsole {
//     return this.console;
//   }
//
//   checkFinish(): boolean {
//     if (this.level.isFinished(this.owl.data())) {
//       // Finished, init interpreter and check
//       this.init();
//       return this.interpreter?.checkFinish() ?? true;
//     }
//     return false;
//   }
// }
