import { createContext, useContext } from "react";
import type { EvaluatedConstraint } from "../../../../../core/game/constraints.ts";

export type ConstraintsContextType = {
  constraints: EvaluatedConstraint[] | null;
};

export const ConstraintsContext = createContext<ConstraintsContextType | null>(
  null,
);

export function useConstraints() {
  const ctx = useContext(ConstraintsContext);
  if (!ctx) {
    throw new Error(
      "useConstraintsHandler must be used within ConstraintsContext.Provider",
    );
  }
  return ctx;
}
