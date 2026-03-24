import type { Level } from "../../../../core/game/level.ts";
import { type PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import { type EditorSettings } from "../settings/EditorSettingsContext.tsx";
import type {
  Constraint,
  EvaluatedConstraint,
} from "../../../../core/game/constraints.ts";
import { useConstraintsHandler } from "./hooks/useConstraintsHandler.ts";
import { useEngine } from "./hooks/useEngine.ts";
import { useRunner } from "./hooks/useRunner.ts";
import {
  ExecutionContext,
  type ExecutionContextType,
} from "./contexts/ExecutionContext.tsx";
import {
  ConstraintsContext,
  type ConstraintsContextType,
} from "./contexts/ConstraintsContext.tsx";
import {
  OutputContext,
  type OutputContextType,
} from "./contexts/OutputContext.tsx";
import { GameContext, type GameContextType } from "./contexts/GameContext.tsx";
import {
  BreakpointsContext,
  type BreakpointsContextType,
} from "./contexts/BreakpointsContext.tsx";

type InterpreterProviderProps = PropsWithChildren<{
  code: string;
  level: Level;
  settings: EditorSettings;
  constraints?: Constraint[];
  onFinish?: (evaluatedConstraints: EvaluatedConstraint[]) => void;
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
 * @param constraints Optional constraints for the task that determine full vs partial completion.
 * @param children The child components that will have access to the interpreter context.
 * @param onFinish Optional callback to call when the level is finished, with boolean indicating if constraints were met.
 */
export function InterpreterProvider({
  code,
  level,
  settings,
  constraints,
  children,
  onFinish,
}: InterpreterProviderProps) {
  const evaluatedConstraints = useConstraintsHandler(code, constraints ?? []);
  const onFinishWithConstraints = useCallback(() => {
    onFinish?.(evaluatedConstraints ?? []);
  }, [evaluatedConstraints, onFinish]);
  const {
    interpreterRef,
    setSnapshot,
    step,
    canStep,
    reset: resetInterpreter,
    snapshot,
    init,
  } = useEngine(code, level, onFinishWithConstraints);
  const { run, stop, isRunning, breakpoints } = useRunner(
    interpreterRef,
    setSnapshot,
    init,
    settings.isInstant,
    settings.instructionsPerSecond,
  );

  const reset = useCallback(() => {
    stop();
    resetInterpreter();
  }, [resetInterpreter, stop]);

  // Reset when code changes
  useEffect(() => {
    reset();
  }, [code, reset]);

  // Remove invalid breakpoints
  const { setBreakpoints } = breakpoints;
  useEffect(() => {
    const lines = code.split("\n").length;
    setBreakpoints((prev) => {
      const next = prev.filter((line) => line < lines);
      return next.length === prev.length ? prev : next;
    });
  }, [setBreakpoints, code]);

  const executionValue = useMemo<ExecutionContextType>(
    () => ({
      run,
      stop,
      canStep,
      step,
      reset,
      isRunning,
      currentLine: snapshot.line,
    }),
    [canStep, isRunning, reset, run, snapshot.line, step, stop],
  );

  const gameValue = useMemo<GameContextType>(
    () => ({
      level,
      owl: snapshot.owl,
      marks: snapshot.marks,
    }),
    [level, snapshot.owl, snapshot.marks],
  );

  const outputValue = useMemo<OutputContextType>(
    () => ({
      output: snapshot.output,
    }),
    [snapshot.output],
  );

  const constraintsValue = useMemo<ConstraintsContextType>(
    () => ({
      constraints: evaluatedConstraints,
    }),
    [evaluatedConstraints],
  );

  const breakpointsValue = useMemo<BreakpointsContextType>(
    () => ({
      ...breakpoints,
    }),
    [breakpoints],
  );
  return (
    <ExecutionContext.Provider value={executionValue}>
      <GameContext.Provider value={gameValue}>
        <OutputContext.Provider value={outputValue}>
          <ConstraintsContext.Provider value={constraintsValue}>
            <BreakpointsContext.Provider value={breakpointsValue}>
              {children}
            </BreakpointsContext.Provider>
          </ConstraintsContext.Provider>
        </OutputContext.Provider>
      </GameContext.Provider>
    </ExecutionContext.Provider>
  );
}
