import {
  type BreakpointsHandler,
  useBreakpointsHandler,
} from "./useBreakpointsHandler.ts";
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  Interpreter,
  InterpreterSnapshot,
} from "../../../../../core/interpreter/interpreter.ts";

const INSTANT_BATCH_SIZE = 500;

type InterpreterRunner = {
  run: () => void;
  stop: () => void;
  isRunning: boolean;
  breakpoints: BreakpointsHandler;
};

export function useRunner(
  interpreterRef: RefObject<Interpreter | null>,
  setSnapshot: Dispatch<SetStateAction<InterpreterSnapshot>>,
  init: () => Interpreter | null,
  isInstant: boolean,
  instructionsPerSecond: number,
): InterpreterRunner {
  const breakpoints = useBreakpointsHandler();

  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const run = useCallback(() => {
    stop();
    setIsRunning(true);

    // Get/init interpreter
    let interpreter = interpreterRef.current;
    if (!interpreter) {
      interpreter = init();
      if (!interpreter) {
        // Didnt initialize
        setIsRunning(false);
        return;
      }
    }

    // Instant
    if (isInstant) {
      // Run in chunks to avoid UI freezing
      const runChunk = () => {
        const interpreter = interpreterRef.current;
        if (!interpreter) {
          stop();
          return;
        }

        let count = 0;
        while (interpreter.canStep() && count++ < INSTANT_BATCH_SIZE) {
          interpreter.step();
          const line = interpreter.currentLine() ?? -1;
          if (breakpoints.isBreakpoint(line)) {
            break; // Stop execution
          }
        }
        const snapshot = interpreter.snapshot();
        const line = snapshot.line ?? -1;
        setSnapshot(snapshot);
        if (interpreter.canStep() && !breakpoints.isBreakpoint(line)) {
          animationFrameRef.current = requestAnimationFrame(runChunk);
        } else {
          stop();
        }
      };
      runChunk();
      return;
    }
    // Run with interval
    intervalRef.current = setInterval(() => {
      const interpreter = interpreterRef.current;
      if (!interpreter) return;
      if (interpreter.canStep()) {
        interpreter.step();
        const snapshot = interpreter.snapshot();
        setSnapshot(snapshot);
        if (breakpoints.isBreakpoint(snapshot.line ?? -1)) {
          stop();
        }
      } else {
        stop();
      }
    }, 1000 / instructionsPerSecond);
  }, [
    stop,
    interpreterRef,
    isInstant,
    instructionsPerSecond,
    init,
    setSnapshot,
    breakpoints,
  ]);

  // Restart running if run speed or breakpoints changes
  useEffect(() => {
    if (isRunning) {
      run();
    }
  }, [isRunning, run, instructionsPerSecond, breakpoints]);

  return {
    run,
    stop,
    isRunning,
    breakpoints,
  };
}
