import { createContext, useContext } from "react";
import type { VariableMap } from "../../../../../core/interpreter/environment.ts";

export type ExecutionContextType = {
  // Interpreter controls
  run: () => void;
  stop: () => void;
  canStep: () => boolean;
  step: (steps?: number) => void;
  reset: () => void;
  isRunning: boolean;
  currentLine: number | null;
  variables: VariableMap;
};

export const ExecutionContext = createContext<ExecutionContextType | null>(
  null,
);

export function useExecution() {
  const ctx = useContext(ExecutionContext);
  if (!ctx)
    throw new Error(
      "useExecution must be used within ExecutionContext.Provider",
    );
  return ctx;
}
