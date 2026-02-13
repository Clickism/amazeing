import type { ConsoleMessage } from "../../interpreter/console.ts";
import { type OwlData } from "../../game/owl.ts";
import { createContext, useContext } from "react";
import type { Level } from "../../game/level.ts";
import type { Task } from "../../precourse/task.ts";

export type EditorRuntimeAPI = {
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
  startingLevel: Level;
  setLevel: (level: Level) => void;

  // Task data

  task: Task | null;
  setTask: (task: Task) => void;

  // Editor

  code: string;
  setCode: (code: string) => void;

  output: ConsoleMessage[];

  currentLine: number | null;
  isRunning: boolean;
};

export const EditorRuntimeContext = createContext<EditorRuntimeAPI | null>(
  null,
);

export function useEditorRuntime() {
  const ctx = useContext(EditorRuntimeContext);
  if (!ctx)
    throw new Error(
      "useEditorRuntime must be used within EditorRuntimeProvider",
    );
  return ctx;
}
