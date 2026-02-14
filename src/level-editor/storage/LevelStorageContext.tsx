import { createContext, useContext } from "react";
import type { LevelData } from "../../game/level.ts";

export type LevelStorage = {
  levelNames: string[];
  loadLevel: (name: string) => LevelData | null;
  saveLevel: (name: string, level: LevelData) => void;
  renameLevel: (oldName: string, newName: string) => void;
  deleteLevel: (name: string) => void;
  fileNamespace: string;
};

export const LevelStorageContext = createContext<LevelStorage | null>(null);

export function useLevelStorage() {
  const ctx = useContext(LevelStorageContext);
  if (!ctx)
    throw new Error("useLevelStorage must be used within LevelStorageProvider");
  return ctx;
}
