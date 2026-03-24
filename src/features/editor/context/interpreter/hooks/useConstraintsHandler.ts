import { useEffect, useState } from "react";
import type {
  Constraint,
  EvaluatedConstraint,
} from "../../../../../core/game/constraints.ts";
import { validateConstraints } from "../../../../../core/interpreter/constraints.ts";

export function useConstraintsHandler(code: string, constraints: Constraint[]) {
  const [evaluated, setEvaluated] = useState<EvaluatedConstraint[] | null>(
    null,
  );

  // Evaluate constraints
  useEffect(() => {
    if (!constraints || constraints.length === 0) {
      setEvaluated(null);
      return;
    }
    const evaluated = validateConstraints(constraints, code);
    setEvaluated(evaluated);
  }, [code, constraints]);

  return evaluated;
}
