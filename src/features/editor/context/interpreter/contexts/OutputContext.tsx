import { createContext, useContext } from "react";
import type { ConsoleMessage } from "../../../../../core/interpreter/console.ts";

export type OutputContextType = {
  output: readonly ConsoleMessage[];
};

export const OutputContext = createContext<OutputContextType | null>(null);

export function useOutput() {
  const ctx = useContext(OutputContext);
  if (!ctx) {
    throw new Error("useOutput must be used within OutputContext.Provider");
  }
  return ctx;
}
