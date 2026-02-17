import { type LevelData } from "../../../core/game/level.ts";
import type { MultiSource } from "../../editor/context/source/source.ts";
import { createContext, useContext } from "react";

export type LevelEditorModel = {
  level: LevelData;
  setLevel: (level: LevelData) => void;

  /**
   * The source of the level data.
   */
  source: MultiSource<LevelData>;
};

export const LevelEditorContext = createContext<LevelEditorModel | null>(null);

export function useLevelEditor() {
  const ctx = useContext(LevelEditorContext);
  if (!ctx) {
    throw new Error(
      "useLevelEditor must be used within a LevelEditorProvider.",
    );
  }
  return ctx;
}
