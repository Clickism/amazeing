import type { Level } from "../../../../core/game/level.ts";
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { LevelOwl, type OwlData } from "../../../../core/game/owl.ts";
import {
  type ConsoleMessage,
  InterpreterConsole,
} from "../../../../core/interpreter/console.ts";
import { InterpreterContext } from "./InterpreterContext.tsx";
import {
  Interpreter,
  LazyInterpreter,
} from "../../../../core/interpreter/interpreter.ts";
import { type EditorSettings } from "../settings/EditorSettingsContext.tsx";

const INSTANT_BATCH_SIZE = 500;

type InterpreterProviderProps = PropsWithChildren<{
  code: string;
  level: Level;
  settings: EditorSettings;
  onFinish?: () => void;
}>;

/**
 * Provides the interpreter context for the editor.
 *
 * Manages the interpreter state, including the current output, current line, and running state.
 * Also manages the game state, including the owl data.
 *
 * @param code The code to interpret.
 * @param level The level to run the code on.
 * @param settings The editor settings, used to control the run speed and mode.
 * @param children The child components that will have access to the interpreter context.
 * @param onFinish Optional callback to call when the level is finished.
 */
export function InterpreterProvider({
  code,
  level,
  settings,
  children,
  onFinish,
}: InterpreterProviderProps) {
  // Interpreter
  const [output, setOutput] = useState<ConsoleMessage[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  // Game
  const [owlData, setOwlData] = useState<OwlData>(() => level.createOwlData());
  const owlDataRef = useRef(owlData);
  owlDataRef.current = owlData;

  // Update owl data and keep ref in sync
  const updateOwl = useCallback((newData: OwlData) => {
    owlDataRef.current = newData;
    setOwlData(newData);
  }, []);

  // Refs
  const interpreterRef = useRef<Interpreter | null>(null);
  const runIntervalRef = useRef<number | null>(null);
  const runAnimationFrameRef = useRef<number | null>(null);

  const appendOutput = useCallback((message: ConsoleMessage) => {
    setOutput((prev) => [...prev, message]);
  }, []);

  const stop = useCallback(() => {
    if (runIntervalRef.current !== null) {
      clearInterval(runIntervalRef.current);
      runIntervalRef.current = null;
    }
    if (runAnimationFrameRef.current !== null) {
      cancelAnimationFrame(runAnimationFrameRef.current);
      runAnimationFrameRef.current = null;
    }
    setIsRunning(false);
    setCurrentLine(interpreterRef.current?.getCurrentLine() ?? null);
  }, []);

  const reset = useCallback(() => {
    stop();
    try {
      const newOwlData = level.createOwlData();
      updateOwl(newOwlData);
      setOutput([]);
      const interpreter = LazyInterpreter.fromCode(
        code,
        new InterpreterConsole(appendOutput),
        new LevelOwl(() => owlDataRef.current, updateOwl, level),
        level,
        onFinishRef.current,
      );
      interpreterRef.current = interpreter;
      setCurrentLine(interpreter.getCurrentLine());
    } catch (e) {
      if (e instanceof Error) {
        // Clear previous output for parsing error
        setOutput([{ type: "error", text: e.message }]);
      }
    }
  }, [appendOutput, code, level, stop, updateOwl]);

  const step = useCallback((steps = 1) => {
    interpreterRef.current?.executeAndPrintError((interpreter) => {
      interpreter.stepMultiple(steps);
      setCurrentLine(interpreter.getCurrentLine());
    });
  }, []);

  const run = useCallback(() => {
    stop();
    setIsRunning(true);
    // Instant
    if (settings.isInstant) {
      // Run in chunks to avoid UI freezing
      const runChunk = () => {
        interpreterRef.current?.executeAndPrintError((interpreter) => {
          let count = 0;
          while (interpreter.canStep() && count++ < INSTANT_BATCH_SIZE) {
            interpreter.step();
          }
        });
        const interpreter = interpreterRef.current;
        if (interpreter) {
          setCurrentLine(interpreter.getCurrentLine());
          if (interpreter.canStep()) {
            runAnimationFrameRef.current = requestAnimationFrame(runChunk);
          } else {
            stop();
          }
        } else {
          stop();
        }
      };
      runChunk();
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
  }, [settings.instructionsPerSecond, settings.isInstant, stop]);

  const canStep = useCallback(() => {
    return interpreterRef?.current?.canStep() ?? true;
  }, []);

  useEffect(() => {
    // Check finish on owl data change
    const interpreter = interpreterRef.current;
    if (!interpreter) return;
    try {
      interpreter.checkFinish();
    } catch {
      // Ignored
    }
  }, [owlData]);

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
    <InterpreterContext.Provider
      value={{
        run,
        stop,
        canStep,
        step,
        level,
        owlData,
        setOwlData: updateOwl,
        output,
        currentLine,
        isRunning,
        reset,
      }}
    >
      {children}
    </InterpreterContext.Provider>
  );
}
