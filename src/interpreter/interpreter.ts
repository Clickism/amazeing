import type { Instruction, InstructionData, LabelDefinition, Value } from "./instruction.ts";
import { parse } from "./parser.ts";
import { LocatableError } from "./error.ts";

/**
 * Interpreter for Amazeing.
 */
export class Interpreter {
  pc: number;
  instructions: InstructionData[];
  env: Environment;

  constructor(instructions: InstructionData[], env: Environment) {
    this.pc = 0;
    this.instructions = instructions;
    this.env = env;
  }

  /**
   * Parses the given code and returns a new Interpreter instance.
   * @param code The code to parse.
   */
  static fromCode(code: string): Interpreter {
    const { instructions, labels } = parse(code);
    return new Interpreter(instructions, new Environment(labels));
  }

  /**
   * Executes the next instruction.
   *
   * @throws {Error} If the program has already terminated.
   * @throws {LocatableError} If an error occurs during execution.
   */
  step() {
    if (this.pc >= this.instructions.length) {
      throw new Error("No more instructions to execute.");
    }
    const { instruction, line } = this.instructions[this.pc];
    // For now, we just log the instruction and increment the pc
    console.log(`Executing line ${line}:`, JSON.stringify(instruction));
    const pcTarget = this.executeInstruction({ instruction, line });
    if (pcTarget) {
      const { targetLabel, type } = pcTarget;
      const labelDef = this.env.labels.get(targetLabel);
      if (!labelDef) {
        throw new LocatableError(line, `Label "${targetLabel}" not found`);
      }
      if (type === "call") {
        // Push a new stack frame
        // TODO
        this.pc = labelDef.line;
      } else {
        // Regular jump
        this.pc = labelDef.line;
      }
    } else {
      // Increment pc by one
      this.pc++;
    }
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
      return executor(this.env);
    } catch (err) {
      if (err instanceof Error) {
        throw new LocatableError(line, err.message);
      }
    }
  }
}

const executors = {
  move: (env) => {
    // Move the player forward
    return;
  },
} as Record<Instruction["type"], (env: Environment) => PcTarget | undefined>;

export type VariableMap = Map<string, Value | null>;

export type StackEntry = {
  returnAddress: number | undefined;
  variables: VariableMap;
};

type PcTarget = {
  type: "call" | "jump";
  targetLabel: string;
};

/**
 * Environment for the interpreter.
 */
class Environment {
  labels: Map<string, LabelDefinition>;
  private global: VariableMap;
  private stack: StackEntry[];
  private args: VariableMap;

  constructor(
    labels: Map<string, LabelDefinition>,
    global: VariableMap = new Map(),
    stack: StackEntry[] = [],
    args: VariableMap = new Map(),
  ) {
    this.labels = labels;
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
      if (variables.has(name)) {
        throw new Error(
          `Variable "${name}" is already defined in the current scope.`,
        );
      }
      variables.set(name, value);
    }
  }

  pushStackFrame(returnAddress: number) {
    this.stack.push({ returnAddress, variables: new Map() });
  }
}
