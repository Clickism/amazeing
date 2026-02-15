import { createContext, useContext } from "react";
import type { Level } from "../../../core/game/level.ts";

type LevelContext = {
  level: Level;
  setLevel: (level: Level) => void;
  initialLevel: Level;
};

export const LevelContext = createContext<LevelContext | null>(null);

export function useLevel() {
  const ctx = useContext(LevelContext);
  if (!ctx)
    throw new Error("useLevel must be used within a LevelProvider");
  return ctx;
}
