import type { Level } from "../../game/level.ts";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Owl } from "../../game/owl.ts";
import {
  type ConsoleMessage,
  InterpreterConsole,
} from "../../interpreter/console.ts";
import { EditorRuntimeContext } from "./EditorRuntimeContext.tsx";
import { Interpreter, LazyInterpreter } from "../../interpreter/interpreter.ts";
import { useEditorSettings } from "../settings/EditorSettingsContext.tsx";

type EditorRuntimeProviderProps = {
  startingLevel: Level;
  children: ReactNode;
};

export function EditorRuntimeProvider({
  startingLevel,
  children,
}: EditorRuntimeProviderProps) {
  const [level, setLevel] = useState(startingLevel);
  const { settings } = useEditorSettings();

  // Interpreter
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<ConsoleMessage[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Game
  const [owl, setOwl] = useState<Owl>(() =>
    level.createOwl((newOwl) => setOwl({ ...newOwl })),
  );

  // Refs
  const interpreterRef = useRef<Interpreter | null>(null);
  const runIntervalRef = useRef<number | null>(null);

  const appendOutput = useCallback((message: ConsoleMessage) => {
    setOutput((prev) => [...prev, message]);
  }, []);

  const stop = useCallback(() => {
    if (runIntervalRef.current !== null) {
      clearInterval(runIntervalRef.current);
      runIntervalRef.current = null;
      setIsRunning(false);
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    try {
      const newOwl = level.createOwl((newOwl) => setOwl({ ...newOwl }));
      setOwl(newOwl);
      setOutput([]);
      const interpreter = LazyInterpreter.fromCode(
        code,
        new InterpreterConsole(appendOutput),
        newOwl,
        level,
      );
      interpreterRef.current = interpreter;
      setCurrentLine(interpreter.getCurrentLine());
    } catch (e) {
      if (e instanceof Error) {
        // Clear previous output for parsing error
        setOutput([{ type: "error", text: e.message }]);
      }
    }
  }, [appendOutput, code, level, stop]);

  const step = useCallback((steps = 1) => {
    interpreterRef.current?.executeAndPrintError((interpreter) => {
      interpreter.stepMultiple(steps);
      setCurrentLine(interpreter.getCurrentLine());
    });
  }, []);

  const run = useCallback(() => {
    stop();
    // Instant
    if (settings.isInstant) {
      interpreterRef.current?.executeAndPrintError((interpreter) => {
        interpreter.run();
      });
      return;
    }
    // Run with interval
    runIntervalRef.current = setInterval(() => {
      const interpreter = interpreterRef.current;
      if (!interpreter) return;
      if (interpreter.canStep()) {
        interpreter.executeAndPrintError((interpreter) => {
          interpreter.step();
          setCurrentLine(interpreter.getCurrentLine());
        });
      } else {
        stop();
      }
    }, 1000 / settings.instructionsPerSecond);
    setIsRunning(true);
  }, [settings.instructionsPerSecond, settings.isInstant, stop]);

  const canStep = useCallback(() => {
    return interpreterRef?.current?.canStep() ?? true;
  }, []);

  // Reset interpreter when code or level changes
  useEffect(() => {
    reset();
  }, [code, level, reset]);

  // Restart running if run speed changes
  useEffect(() => {
    if (isRunning) {
      run();
    }
  }, [isRunning, run, settings.instructionsPerSecond]);

  return (
    <EditorRuntimeContext.Provider
      value={{
        run,
        stop,
        canStep,
        step,
        level,
        startingLevel,
        setLevel,
        code,
        setCode,
        owl,
        output,
        currentLine,
        isRunning,
        reset,
      }}
    >
      {children}
    </EditorRuntimeContext.Provider>
  );
}
