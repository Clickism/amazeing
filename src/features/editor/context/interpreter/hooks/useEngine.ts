import type { Level } from "../../../../../core/game/level.ts";
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  emptySnapshot,
  Interpreter,
  type InterpreterSnapshot,
} from "../../../../../core/interpreter/interpreter.ts";

type InterpreterEngine = {
  interpreterRef: RefObject<Interpreter | null>;
  snapshot: InterpreterSnapshot;
  setSnapshot: Dispatch<SetStateAction<InterpreterSnapshot>>;
  // Controls
  reset: () => void;
  step: (steps?: number) => void;
  canStep: () => boolean;
  // Initializes the interpreter manually,
  init: () => Interpreter | null;
};

export function useEngine(
  code: string,
  level: Level,
  onFinish?: () => void,
  maxSteps?: number,
): InterpreterEngine {
  const interpreterRef = useRef<Interpreter | null>(null);

  const [snapshot, setSnapshot] = useState<InterpreterSnapshot>(() =>
    emptySnapshot(level),
  );

  const reset = useCallback(() => {
    // Clear out interpreter
    interpreterRef.current = null;
    setSnapshot(emptySnapshot(level));
  }, [level]);

  // Initializes the interpreter
  const init = useCallback(() => {
    try {
      const interpreter = Interpreter.fromCode(code, level, maxSteps);
      interpreter.onFinish = onFinish;
      interpreterRef.current = interpreter;
      setSnapshot(interpreter.snapshot());
      return interpreter;
    } catch (e) {
      if (e instanceof Error) {
        setSnapshot((prev) => ({
          ...prev,
          output: [{ type: "error", text: e.message }],
        }));
      }
      return null;
    }
  }, [code, level, maxSteps, onFinish]);

  // Steps the interpreter
  const step = useCallback(
    (steps = 1) => {
      let interpreter = interpreterRef.current;
      if (!interpreter) {
        interpreter = init();
        if (!interpreter) return; // Initialization failed
      }

      interpreter.step(steps);
      setSnapshot(interpreter.snapshot());
    },
    [init],
  );

  const canStep = useCallback(() => {
    const interpreter = interpreterRef.current;
    if (interpreter) return interpreter.canStep();
    // Check if there is code to execute
    const codeLines = code
      .split("\n")
      .filter((l) => l !== "" && !l.startsWith("#")).length;
    return codeLines > 0;
  }, [code]);

  return {
    interpreterRef,
    snapshot,
    setSnapshot,
    reset,
    step,
    canStep,
    init,
  };
}
