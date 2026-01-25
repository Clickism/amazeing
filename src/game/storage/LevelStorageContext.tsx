import { createContext, useContext } from "react";
import type { LevelData } from "../level.ts";

export type LevelStorage = {
  levelNames: string[];
  loadLevel: (name: string) => LevelData | null;
  addLevel: (level: LevelData) => void;
  renameLevel: (oldName: string, newName: string) => void;
  deleteLevel: (name: string) => void;
};

export const LevelStorageContext = createContext<LevelStorage | null>(null);

export function useLevelStorage() {
  const ctx = useContext(LevelStorageContext);
  if (!ctx)
    throw new Error("useLevelStorage must be used within LevelStorageProvider");
  return ctx;
}
