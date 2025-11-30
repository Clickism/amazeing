import type {
  Instruction,
  ThreeVarIntermediateInstruction,
} from "./instruction.ts";
import { Environment } from "./environment.ts";
import { ErrorWithTip } from "./error.ts";
import type { PcTarget } from "./interpreter.ts";

export type Executor<T extends Instruction["type"]> = (
  env: Environment,
  instruction: Extract<Instruction, { type: T }>,
) => PcTarget | undefined;

type Executors = {
  [K in Instruction["type"]]: Executor<K>;
};

/**
 * Executors for each instruction type.
 */
export const EXECUTORS = {
  move: () => {
    throw new Error("Not implemented");
  },

  turn: () => {
    throw new Error("Not implemented");
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
    const value = env.getOrThrow(src);
    // TODO: Add type information
    env.console.log({ type: "log", text: `DEBUG: ${src} = ${value}, type = ${typeof value}` });
  },
} as Executors;

/**
 * Executes an arithmetic operation.
 */
function arithmeticExecutor(
  env: Environment,
  instruction: ThreeVarIntermediateInstruction<unknown>,
  operation: (a: number, b: number) => number,
) {
  const { dest, src1, src2 } = instruction;
  const val1 = env.getIntegerOrThrow(src1);
  const val2 = typeof src2 == "number" ? src2 : env.getIntegerOrThrow(src2);
  const result = operation(val1, val2);
  env.setOrThrow(dest, result);
}

/**
 * Executes a logical operation, storing 1 for true and 0 for false.
 */
function logicalExecutor(
  env: Environment,
  instruction: ThreeVarIntermediateInstruction<unknown>,
  cond: (a: number, b: number) => boolean,
) {
  return arithmeticExecutor(env, instruction, (a, b) => (cond(a, b) ? 1 : 0));
}
