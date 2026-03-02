import type { ConsoleMessage } from "../../../../core/interpreter/console.ts";
import { type OwlData } from "../../../../core/game/owl.ts";
import { createContext, useContext } from "react";
import type { Level } from "../../../../core/game/level.ts";
import type { MarkData } from "../../../../core/game/marks.ts";

export type InterpreterAPI = {
  // Game controls
  run: () => void;
  stop: () => void;
  canStep: () => boolean;
  step: (steps?: number) => void;
  reset: () => void;

  // Game data
  owlData: OwlData;
  setOwlData: (owlData: OwlData) => void;
  level: Level;
  markData: MarkData;
  setMarkData: (markData: MarkData) => void;

  // Editor
  output: ConsoleMessage[];
  currentLine: number | null;
  isRunning: boolean;
};

export const InterpreterContext = createContext<InterpreterAPI | null>(
  null,
);

export function useInterpreter() {
  const ctx = useContext(InterpreterContext);
  if (!ctx)
    throw new Error(
      "useEditorRuntime must be used within EditorRuntimeProvider",
    );
  return ctx;
}
