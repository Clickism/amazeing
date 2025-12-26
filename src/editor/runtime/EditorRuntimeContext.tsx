import type { ConsoleMessage } from "../../interpreter/console.ts";
import type { Owl } from "../../game/owl.ts";
import { createContext, useContext } from "react";
import type { Level } from "../../game/level.ts";

export type EditorRuntimeAPI = {
  run: () => void;
  stop: () => void;
  canStep: () => boolean;
  step: (steps?: number) => void;
  reset: () => void;

  owl: Owl;
  level: Level;

  code: string;
  setCode: (code: string) => void;

  output: ConsoleMessage[];

  currentLine: number | null;
  isRunning: boolean;
};

export const EditorRuntimeContext = createContext<EditorRuntimeAPI | null>(null);

export function useEditorRuntime() {
  const ctx = useContext(EditorRuntimeContext);
  if (!ctx)
    throw new Error(
      "useEditorRuntime must be used within EditorRuntimeProvider",
    );
  return ctx;
}
