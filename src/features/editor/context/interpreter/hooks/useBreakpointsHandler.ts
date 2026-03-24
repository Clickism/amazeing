import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

export type BreakpointsHandler = {
  breakpoints: number[];
  setBreakpoints: Dispatch<SetStateAction<number[]>>;
  isBreakpoint: (line: number) => boolean;
};

export function useBreakpointsHandler(): BreakpointsHandler {
  const [breakpoints, setBreakpoints] = useState<number[]>([]);
  const lookup = useMemo(() => new Set(breakpoints), [breakpoints]);
  const isBreakpoint = useCallback(
    (line: number) => {
      return lookup.has(line);
    },
    [lookup],
  );
  return {
    breakpoints,
    setBreakpoints,
    isBreakpoint,
  };
}
