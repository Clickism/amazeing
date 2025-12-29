import { createContext, useContext } from "react";
import type { LevelData } from "../level.ts";

export type LevelStorage = {
  levels: readonly LevelData[];
  addLevel: (level: LevelData) => void;
  deleteLevel: (id: string) => void;
};

export const LevelStorageContext = createContext<LevelStorage | null>(null);

export function useLevelStorage() {
  const ctx = useContext(LevelStorageContext);
  if (!ctx)
    throw new Error("useLevelStorage must be used within LevelStorageProvider");
  return ctx;
}
