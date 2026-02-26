import type {
  Instruction,
  ThreeVarGenericInstruction,
  ThreeVarInstruction,
} from "./instruction.ts";
import { Environment } from "./environment.ts";
import { ErrorWithTip } from "./error.ts";
import type { PcTarget } from "./interpreter.ts";
import { booleanToInteger, isValue, type Value } from "./types.ts";

export type Executor<T extends Instruction["type"]> = (
  env: Environment,
  instruction: Extract<Instruction, { type: T }>,
) => PcTarget | void;

type Executors = {
  [K in Instruction["type"]]: Executor<K>;
};

/**
 * Executors for each instruction type.
 */
export const EXECUTORS: Executors = {
  move: (env) => {
    if (!env.owl.move()) {
      throw new Error("Owl cannot move forward due to a wall.");
    }
  },

  turn: (env, { direction }) => {
    env.owl.turn(direction);
  },

  explore: (env, { dest, direction }) => {
    const owl = env.owl;
    const data = owl.data();
    const normalized = owl.normalizeDirection(
      data,
      direction ?? data.direction,
    );
    const isWalkable =
      normalized === "here" ? true : env.level.canOwlMove(data, normalized);
    env.setOrThrow(dest, booleanToInteger(isWalkable));
  },

  var: (env, { name, isArray }) => {
    env.define(name, isArray);
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
    const value = env.getIntegerOrThrow(src);
    env.setOrThrow(dest, ~value);
  },

  sll: (env, instruction) =>
    arithmeticExecutor(env, instruction, (a, b) => a << b),
  srl: (env, instruction) =>
    arithmeticExecutor(env, instruction, (a, b) => a >>> b),
  sra: (env, instruction) =>
    arithmeticExecutor(env, instruction, (a, b) => a >> b),

  lt: (env, instruction) => logicalExecutor(env, instruction, (a, b) => a < b),
  lte: (env, instruction) =>
    logicalExecutor(env, instruction, (a, b) => a <= b),
  gt: (env, instruction) => logicalExecutor(env, instruction, (a, b) => a > b),
  gte: (env, instruction) =>
    logicalExecutor(env, instruction, (a, b) => a >= b),
  eq: (env, instruction) =>
    genericLogicalExecutor(env, instruction, (a, b) => a === b),
  neq: (env, instruction) =>
    genericLogicalExecutor(env, instruction, (a, b) => a !== b),

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
      throw new ErrorWithTip(
        "No stack frame to return to.",
        "Make sure that you are not returning from the main program.",
      );
    }
    return { type: "jump", target: frame.returnAddress };
  },

  exit: (env) => {
    env.console.log({ type: "log", text: "Program exited." });
    return { type: "jump", target: -1 };
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

  debug: (env, { src }) => {
    const value = env.getOrNull(src);
    if (value === null) {
      env.console.log({ type: "log", text: `DEBUG: ${src} = NO VALUE` });
    } else {
      // TODO: Add type information
      env.console.log({
        type: "log",
        text: `DEBUG: ${src} = ${value}, type = ${typeof value}`,
      });
    }
  },

  mark: (env, { direction }) => {
    env.mark(direction);
  },

  unmark: (env, { direction }) => {
    env.unmark(direction);
  },

  getmark: (env, { src }) => {
    const mark = env.getMark();
    env.setOrThrow(src, mark);
  },

  getdir: (env, { src }) => {
    const dir = env.owl.data().direction;
    env.setOrThrow(src, dir);
  },
};

/**
 * Executes an arithmetic operation, that only operates on numbers.
 */
function arithmeticExecutor(
  env: Environment,
  instruction: ThreeVarInstruction<unknown>,
  operation: (a: number, b: number) => number,
) {
  const { dest, src1, src2 } = instruction;
  const val1 = env.getIntegerOrThrow(src1);
  const val2 = typeof src2 == "number" ? src2 : env.getIntegerOrThrow(src2);
  const result = operation(val1, val2);
  env.setOrThrow(dest, result);
}

/**
 * Executes a generic arithmetic operation, hat can operate on any Value type.
 */
function genericArithmeticExecutor(
  env: Environment,
  instruction: ThreeVarGenericInstruction<unknown>,
  operation: (a: Value, b: Value) => Value,
) {
  const { dest, src1, src2 } = instruction;
  const val1 = env.getValueOrThrow(src1);
  const val2 = isValue(src2) ? src2 : env.getValueOrThrow(src2);
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
  return arithmeticExecutor(env, instruction, (a, b) =>
    booleanToInteger(cond(a, b)),
  );
}

/**
 * Executes a generic logical operation, storing 1 for true and 0 for false.
 */
function genericLogicalExecutor(
  env: Environment,
  instruction: ThreeVarGenericInstruction<unknown>,
  cond: (a: Value, b: Value) => boolean,
) {
  return genericArithmeticExecutor(env, instruction, (a, b) =>
    booleanToInteger(cond(a, b)),
  );
}
