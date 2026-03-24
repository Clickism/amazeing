import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
} from "react";

export type BreakpointsContextType = {
  breakpoints: number[];
  setBreakpoints: Dispatch<SetStateAction<number[]>>;
  isBreakpoint: (line: number) => boolean;
};

export const BreakpointsContext = createContext<BreakpointsContextType | null>(
  null,
);

export function useBreakpoints() {
  const ctx = useContext(BreakpointsContext);
  if (!ctx) {
    throw new Error("useInterpreterBreakpoints must be used within BreakpointsContext.Provider");
  }
  return ctx;
}
