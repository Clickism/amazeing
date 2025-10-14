import type { LabelDefinition } from "./instruction.ts";
import { InterpreterConsole } from "./console.ts";
import type { Owl } from "./owl.ts";
import type { Value } from "./types.ts";

export type VariableMap = Map<string, Value | null>;

export type StackFrame = {
  returnAddress: number | undefined;
  variables: VariableMap;
};

/**
 * Environment for the interpreter.
 */
export class Environment {
  labels: Map<string, LabelDefinition>;
  console: InterpreterConsole;
  private global: VariableMap;
  private stack: StackFrame[];
  private args: VariableMap;
  owl?: Owl;

  constructor(
    labels: Map<string, LabelDefinition>,
    interpreterConsole: InterpreterConsole,
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
   * @throws {Error} if the variable is not defined.
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
   * @throws {Error} if the variable is not defined or not set.
   */
  getOrThrow(name: string): Value {
    const value = this.getOrNull(name);
    if (value === null) {
      throw new Error(`Variable "${name}" is not set.`);
    }
    return value;
  }

  /**
   * Defines a new variable in the current scope.
   * @param name The name of the variable.
   * @throws {Error} if the variable is already defined in the current scope.
   */
  define(name: string) {
    this.set(name, null);
  }

  /**
   * Sets the value of a variable in the current scope or throws if it's not defined.
   * @param name The name of the variable.
   * @param value The value to set.
   * @throws {Error} if the variable is not defined in the current scope.
   */
  setOrThrow(name: string, value: Value) {
    if (!this.isDefined(name)) {
      throw new Error(`Variable "${name}" is not defined.`);
    }
    this.set(name, value);
  }

  /**
   * Sets the value of a variable in the current scope.
   */
  set(name: string, value: Value | null) {
    if (this.stack.length === 0) {
      this.stack.push({ returnAddress: undefined, variables: new Map() });
    }
    // Set in the top stack frame
    const { variables } = this.stack[this.stack.length - 1];
    variables.set(name, value);
  }

  /**
   * Checks if a variable is defined in the current scope.
   * @param name The name of the variable.
   */
  isDefined(name: string): boolean {
    return this.get(name) !== undefined;
  }

  /**
   * Gets a label or throws if it's not found.
   * @param name The name of the label.
   * @throws {Error} if the label is not found.
   */
  getLabelOrThrow(name: string): LabelDefinition {
    const label = this.labels.get(name);
    if (!label) {
      throw new Error(`Label "${name}" not found`);
    }
    return label;
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
