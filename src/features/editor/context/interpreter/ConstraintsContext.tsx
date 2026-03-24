import type { EvaluatedConstraint } from "../../../../core/game/constraints.ts";
import { createContext, useContext } from "react";

export type ConstraintsContextType = {
  constraints?: EvaluatedConstraint[];
};

export const ConstraintsContext = createContext<ConstraintsContextType | null>(
  null,
);

export function useConstraints() {
  const ctx = useContext(ConstraintsContext);
  if (!ctx) {
    throw new Error(
      "useConstraints must be used within ConstraintsContext.Provider",
    );
  }
  return ctx;
}
