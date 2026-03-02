import type { Constraint, EvaluatedConstraint } from "../game/constraints";
import type { InstructionData } from "./instruction";

export function validateConstraints(
  constraints: Constraint[],
  instructions: InstructionData[],
): EvaluatedConstraint[] {
  const encounteredConstraints = new Set<string>();
  const evaluatedConstraints: EvaluatedConstraint[] = [];
  for (const constraint of constraints) {
    switch (constraint.type) {
      case "max-instructions": {
        if (encounteredConstraints.has("max-instructions")) {
          throw new Error(
            "Multiple max-instructions constraints are not allowed",
          );
        }
        const met = instructions.length <= constraint.count;
        evaluatedConstraints.push({ ...constraint, met });
        break;
      }
      case "allowed-instructions": {
        if (encounteredConstraints.has("allowed-instructions")) {
          throw new Error(
            "Multiple allowed-instructions constraints are not allowed",
          );
        }
        let met = true;
        for (const instr of instructions) {
          if (!constraint.allowed.includes(instr.instruction.type)) {
            met = false;
            break;
          }
        }
        evaluatedConstraints.push({ ...constraint, met });
        break;
      }
      case "max-instruction-count": {
        let count = 0;
        let met = true;
        for (const instr of instructions) {
          if (instr.instruction.type === constraint.instruction) {
            count++;
            if (count > constraint.count) {
              met = false;
              break;
            }
          }
        }
        evaluatedConstraints.push({ ...constraint, met });
        break;
      }
    }
    encounteredConstraints.add(constraint.type);
  }
  return evaluatedConstraints;
}
