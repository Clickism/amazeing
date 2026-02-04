import type { LabelDefinition } from "./instruction.ts";
import { InterpreterConsole } from "./console.ts";
import { Owl } from "../game/owl.ts";
import {
  type Address,
  type Array,
  type ArrayAccess,
  type Integer,
  isArrayAccess,
  type Value,
  type Variable,
} from "./types.ts";
import { ErrorWithTip } from "./error.ts";
import type { Level } from "../game/level.ts";

export type VariableValue = Value | Array | null;
export type VariableValueNotNull = Value | Array;
export type VariableMap = Map<string, VariableValue>;

export type StackFrame = {
  returnAddress: number | undefined;
  variables: VariableMap;
};

function isArg(address: Address) {
  if (isArrayAccess(address)) {
    return false;
  }
  return /^arg\d+$/.test(address);
}

/**
 * Environment for the interpreter.
 */
export class Environment {
  labels: Map<string, LabelDefinition>;
  console: InterpreterConsole;
  owl: Owl;
  level: Level;
  private global: VariableMap;
  private readonly stack: StackFrame[];
  private args: VariableMap;

  constructor(
    labels: Map<string, LabelDefinition>,
    interpreterConsole: InterpreterConsole,
    owl: Owl,
    level: Level,
    global: VariableMap = new Map(),
    stack: StackFrame[] = [],
    args: VariableMap = new Map(),
  ) {
    this.labels = labels;
    this.console = interpreterConsole;
    this.global = global;
    this.stack = stack;
    this.args = args;
    this.owl = owl;
    this.level = level;
  }

  /**
   * Gets the value at an address.
   */
  get(address: Address): VariableValue | undefined {
    if (isArrayAccess(address)) {
      return this.getArrayValue(address);
    }
    if (this.stack.length > 0) {
      const { variables } = this.stack[this.stack.length - 1];
      if (variables.has(address)) {
        return variables.get(address);
      }
    }
    if (this.args.has(address)) {
      return this.args.get(address);
    }
    return this.global.get(address);
  }

  getArray(name: Variable): Array {
    const array = this.get(name);
    if (array === null || array === undefined) {
      throw new Error(`Array "${name}" is not defined.`);
    }
    if (!Array.isArray(array)) {
      throw new Error(`Variable "${name}" is not an array.`);
    }
    return array;
  }

  /**
   * Gets the value of a variable or null if it's not defined.
   * @param address The name of the variable.
   * @throws {Error} if the variable is not defined.
   */
  getOrNull(address: Address): VariableValue {
    const value = this.get(address);
    if (value === undefined) {
      if (this.isDefinedAnywhere(address)) {
        if (isArg(address)) {
          throw new Error(
            `Argument "${address}" was not set before calling this function.`,
          );
        }
        throw new ErrorWithTip(
          `Variable "${address}" is defined outside of the current scope.`,
          "When calling a subroutine, you can't access variables defined outside of it. " +
            "To pass data to a subroutine, use arguments. i.E: arg0, arg1, etc.",
        );
      }
      throw new Error(`Variable "${address}" is not defined.`);
    }
    return value;
  }

  /**
   * Gets the value of a variable or throws an error if it's not defined or not set.
   * @param address The name of the variable.
   * @throws {Error} if the variable is not defined or not set.
   */
  getOrThrow(address: Address): VariableValueNotNull {
    const value = this.getOrNull(address);
    if (value === null) {
      throw new Error(`Variable "${address}" is not set.`);
    }
    return value;
  }

  getIntegerOrThrow(address: Address): Integer {
    const value = this.getOrThrow(address);
    if (typeof value !== "number") {
      throw new Error(`Variable "${address}" does not contain an integer.`);
    }
    return value;
  }

  getValueOrThrow(address: Address): Value {
    const value = this.getOrThrow(address);
    if (Array.isArray(value)) {
      throw new Error(`Variable "${address}" is an array, not a value.`);
    }
    return value;
  }

  /**
   * Defines a new variable in the current scope.
   * @param identifier The name of the variable.
   * @param isArray Whether the variable is an array.
   * @throws {Error} if the variable is already defined in the current scope.
   */
  define(identifier: Variable, isArray: boolean = false) {
    // ----------
    // Note: We allow redefining of variables for simplicity!
    //
    // if (this.isDefined(identifier)) {
    //   throw new Error(`Variable "${identifier}" is already defined.`);
    // }
    // ----------
    if (isArray) {
      this.set(identifier, []);
      return;
    }
    this.set(identifier, null);
  }

  /**
   * Sets the value of a variable in the current scope or throws if it's not defined.
   * @param address The name of the variable.
   * @param value The value to set.
   * @throws {Error} if the variable is not defined in the current scope.
   */
  setOrThrow(address: Address, value: VariableValue) {
    if (isArrayAccess(address)) {
      if (!this.isDefined(address.array)) {
        throw new Error(`Array "${address.array}" is not defined.`);
      }
    } else {
      if (!this.isDefined(address)) {
        throw new Error(`Variable "${address}" is not defined.`);
      }
    }
    this.set(address, value);
  }

  /**
   * Sets the value of a variable in the current scope.
   */
  set(address: Address, value: VariableValue) {
    if (isArg(address)) {
      // Not an array access, so safe to cast
      this.args.set(address as Variable, value);
      return;
    }
    if (this.stack.length === 0) {
      this.stack.push({ returnAddress: undefined, variables: new Map() });
    }
    // Set in the top stack frame
    const { variables } = this.stack[this.stack.length - 1];
    if (isArrayAccess(address)) {
      this.setArrayValue(address, value as Value);
      return;
    }
    variables.set(address, value);
  }

  /**
   * Checks if a variable is defined in the current scope.
   * @param address The name of the variable.
   */
  isDefined(address: Address): boolean {
    if (isArrayAccess(address)) {
      return this.isDefined(address.array);
    }
    if (isArg(address)) {
      return true;
    }
    return this.get(address) !== undefined;
  }

  /**
   * Checks if a given address is defined in a specific stack frame.
   * @param address The address to check.
   * @param frame The stack frame to check.
   */
  isDefinedInFrame(address: Address, frame: StackFrame): boolean {
    if (isArrayAccess(address)) {
      return frame.variables.has(address.array);
    }
    return frame.variables.has(address);
  }

  /**
   * Checks if a variable is defined anywhere (current scope or any stack frame).
   * @param address The name of the variable.
   */
  isDefinedAnywhere(address: Address): boolean {
    if (this.isDefined(address)) return true;
    if (this.stack.length === 0) return false;
    let stack: StackFrame;
    for (let i = 0; i < this.stack.length; i++) {
      stack = this.stack[i];
      if (this.isDefinedInFrame(address, stack)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets a label or throws if it's not found.
   * @param name The name of the label.
   * @throws {Error} if the label is not found.
   */
  getLabelOrThrow(name: string): LabelDefinition {
    const label = this.labels.get(name);
    if (!label) {
      throw new Error(`Label "${name}" not found.`);
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

  private getArrayValue(address: ArrayAccess): Value | null | undefined {
    const array = this.getArray(address.array);
    // Get index
    const index = this.getValidArrayIndex(address);
    const value = array[index];
    if (value === null || value === undefined) {
      throw new ErrorWithTip(
        `Array element at index ${index} of array "${address.array}" is not set.`,
        `Make sure you initialize all elements of the array in order before accessing them.`,
      );
    }
    return value;
  }

  private getValidArrayIndex(
    access: ArrayAccess,
    resize: boolean = false,
  ): number {
    let index: number;
    if (typeof access.index === "number") {
      index = access.index;
    } else {
      const val = this.getOrThrow(access.index);
      if (typeof val !== "number") {
        throw new Error(
          `Array index "${access.index}" does not store a number.`,
        );
      }
      index = val;
    }
    const array = this.getArray(access.array);
    if (resize && index >= array.length) {
      this.resizeArray(array, index + 1);
    }
    if (index < 0 || index >= array.length) {
      throw new Error(
        `Array index out of bounds: ${index} for array "${access.array}" of length ${array.length}.`,
      );
    }
    return index;
  }

  private resizeArray(array: Array, newSize: number) {
    while (array.length < newSize) {
      array.push(null);
    }
  }

  private setArrayValue(address: ArrayAccess, value: Value) {
    const arrayName = address.array;
    const array = this.getArray(arrayName);
    const index = this.getValidArrayIndex(address, true);
    // Check type
    if (array.length > 0) {
      const elem = array[0];
      if (elem !== null && elem !== undefined && typeof elem !== typeof value) {
        // TODO: Better message
        throw new Error(
          `Cannot add value of type "${typeof value}" to array "${arrayName}" of type "${typeof array[0]}"`,
        );
      }
    }
    array[index] = value;
  }
}
