import type { LabelDefinition } from "./instruction.ts";
import { type InterpreterConsole } from "./console.ts";
import { LevelOwl, Owl } from "../game/owl.ts";
import {
  type Address,
  type Array,
  type ArrayAccess,
  getVariableOf,
  type Integer,
  isArrayAccess,
  type Value,
  type Variable,
} from "./types.ts";
import { ErrorWithTip } from "./error.ts";
import type { Level } from "../game/level.ts";
import { emptyMarks, Marks } from "../game/marks.ts";
import { PREDEFINED_VARIABLES } from "./vars.ts";

export type VariableValue = Value | Array | null;
export type VariableValueNotNull = Value | Array;
export type VariableMap = Map<string, VariableValue>;
export type LabelMap = Map<string, LabelDefinition>;

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
  labels: LabelMap;
  console: InterpreterConsole;
  owl: Owl;
  level: Level;
  marks: Marks;
  private readonly stack: StackFrame[];
  private args: VariableMap;

  constructor(
    labels: LabelMap,
    interpreterConsole: InterpreterConsole,
    level: Level,
    stack: StackFrame[] = [],
    args: VariableMap = new Map(),
  ) {
    this.labels = labels;
    this.console = interpreterConsole;
    this.stack = stack;
    this.args = args;
    this.owl = new LevelOwl(level.createOwlData(), level);
    this.level = level;
    this.marks = new Marks(emptyMarks(level.maze.width(), level.maze.height()));
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
    const predefined = PREDEFINED_VARIABLES[address];
    if (predefined) {
      if (predefined.onGet === undefined) {
        throw new Error(`Cannot read from predefined variable "${address}"`);
      }
      return predefined.onGet(this);
    }
    return undefined;
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
      throw new Error(
        `Variable "${getVariableOf(address)}" does not contain an integer.`,
      );
    }
    return value;
  }

  getValueOrThrow(address: Address): Value {
    const value = this.getOrThrow(address);
    if (Array.isArray(value)) {
      throw new Error(
        `Variable "${getVariableOf(address)}" is an array, not a value.`,
      );
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
    if (identifier.startsWith("$")) {
      if (PREDEFINED_VARIABLES[identifier]) {
        throw new ErrorWithTip(
          `Cannot redefine predefined variables like "${identifier}".`,
          `Predefined variables are always defined by default. You can use them directly.`,
        );
      }
      throw new ErrorWithTip(
        `Invalid identifier: "${identifier}".`,
        `Variable names must start with a letter or an underscore and only contain letters, numbers and underscores.`,
      );
    }
    if (isArray) {
      this.set(identifier, []);
      return;
    }
    if (isArg(identifier)) {
      // Do not allow redefining arguments
      throw new ErrorWithTip(
        `Cannot redefine argument variable "${identifier}".`,
        `You don't need to define argument variables before using them.`,
      );
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
    const name = getVariableOf(address);
    const predefined = PREDEFINED_VARIABLES[name];
    if (predefined) {
      if (predefined.onSet === undefined) {
        throw new Error(`Cannot set predefined variable "${address}"`);
      }
      predefined.onSet(value, this);
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
    if (PREDEFINED_VARIABLES[address]) {
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

  /**
   * Gets the current variable map used
   */
  variableMap(): VariableMap {
    if (this.stack.length === 0) return new Map();
    const currentFrame = this.stack[this.stack.length - 1];

    // Copy args and current stack frame
    const map = new Map();
    for (const [name, value] of currentFrame.variables) {
      map.set(name, value);
    }
    for (const [name, value] of this.args) {
      map.set(name, value);
    }
    return map;
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
    // if (array.length > 0) {
    //   const elem = array[0];
    //   if (elem !== null && elem !== undefined && !hasSameType(elem, value)) {
    //     throw new ErrorWithTip(
    //       `Cannot add value of type "${typeOfValue(value)}" to array "${arrayName}" that has elements of type "${typeOfValue(elem)}"`,
    //       `An array's type is decided by the first element that is added to it. Make sure to only add values of the same type to an array.`,
    //     );
    //   }
    // }
    array[index] = value;
  }
}
