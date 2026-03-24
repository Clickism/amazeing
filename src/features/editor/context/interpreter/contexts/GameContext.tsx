import { createContext, useContext } from "react";
import type { OwlData } from "../../../../../core/game/owl.ts";
import type { Level } from "../../../../../core/game/level.ts";
import type { MarkData } from "../../../../../core/game/marks.ts";

export type GameContextType = {
  // Game data
  owl: OwlData;
  level: Level;
  marks: MarkData;
};

export const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within GameContext.Provider");
  }
  return ctx;
}
