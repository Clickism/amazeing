import type { Constraint, EvaluatedConstraint } from "../game/constraints";
import { ALL_INSTRUCTIONS, type InstructionType } from "./instruction";

type Validator<T extends Constraint> = (
  constraint: T,
  instructions: InstructionType[],
) => boolean;

const validators: {
  [K in Constraint["type"]]: Validator<Extract<Constraint, { type: K }>>;
} = {
  // Max number of instructions constraint
  "max-instructions": (constraint, instructions) => {
    return instructions.length <= constraint.count;
  },

  // Allowed instructions constraint
  "allowed-instructions": (constraint, instructions) => {
    for (const type of instructions) {
      if (!constraint.allowed.includes(type)) {
        return false;
      }
    }
    return true;
  },

  // Max count of a specific instruction constraint
  "max-instruction-count": (constraint, instructions) => {
    let count = 0;
    for (const type of instructions) {
      if (type === constraint.instruction) {
        count++;
        if (count > constraint.count) {
          return false;
        }
      }
    }
    return true;
  },
};

export function validateConstraints(
  constraints: Constraint[],
  code: string,
): EvaluatedConstraint[] {
  const instructions = parseInstructionTypes(code);
  const evaluated: EvaluatedConstraint[] = [];
  for (const constraint of constraints) {
    const validator = validators[constraint.type];
    if (validator) {
      const met = validator(constraint as never, instructions);
      evaluated.push({ ...constraint, met });
    } else {
      throw new Error(
        `No validator found for constraint type: ${constraint.type}`,
      );
    }
  }
  return evaluated;
}

// Set for fast lookup
const ALL_INSTRUCTIONS_SET = new Set(ALL_INSTRUCTIONS);

/**
 * Simple parser to extract only instruction types from the code,
 * avoiding regular parsing.
 *
 * Useful so that we don't have to parse the full code to check constraints.
 *
 * @param code code to parse
 */
function parseInstructionTypes(code: string): InstructionType[] {
  return code
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("#") && !line.endsWith(":"))
    .map((line) => line.split(/\s/)[0] as InstructionType)
    // Ignore unknown instructions (i.E: mid-typing)
    .filter((type) => ALL_INSTRUCTIONS_SET.has(type));
}
