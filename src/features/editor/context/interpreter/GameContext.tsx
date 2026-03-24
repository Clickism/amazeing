import type { OwlData } from "../../../../core/game/owl.ts";
import type { Level } from "../../../../core/game/level.ts";
import type { MarkData } from "../../../../core/game/marks.ts";
import { createContext, useContext } from "react";

export type GameContextType = {
  // Game data
  owlData: OwlData;
  setOwlData: (owlData: OwlData) => void;
  level: Level;
  markData: MarkData;
  setMarkData: (markData: MarkData) => void;
};

export const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within GameContext.Provider");
  }
  return ctx;
}
