import type { ConsoleMessage } from "../../../../core/interpreter/console.ts";
import { createContext, useContext } from "react";

export type OutputContextType = {
  output: ConsoleMessage[];
};

export const OutputContext = createContext<OutputContextType | null>(null);

export function useOutput() {
  const ctx = useContext(OutputContext);
  if (!ctx) {
    throw new Error(
      "useOutput must be used within OutputContext.Provider",
    );
  }
  return ctx
}
