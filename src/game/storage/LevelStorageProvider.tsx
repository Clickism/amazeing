import { LevelStorageContext } from "./LevelStorageContext.tsx";
import { type ReactNode } from "react";
import type { LevelData } from "../level.ts";
import {
  usePersistentState,
  usePersistentStorage,
} from "../../utils/storage.ts";

type LevelStorageProviderProps = {
  fileNamespace: string;
  children: ReactNode;
};

export function LevelStorageProvider({
  children,
  fileNamespace,
}: LevelStorageProviderProps) {
  const storage = usePersistentStorage(`levels:${fileNamespace}`);
  const [levels, setLevels] = usePersistentState<Record<string, LevelData>>(
    storage,
    "levels",
    {},
  );

  const loadLevel = (name: string): LevelData | null => {
    return levels[name] || null;
  };

  const addLevel = (level: LevelData) => {
    setLevels((prev) => ({
      ...prev,
      [level.name]: level,
    }));
  };

  const renameLevel = (oldName: string, newName: string) => {
    setLevels((prev) => {
      const newLevels = { ...prev };
      const levelData = newLevels[oldName];
      if (levelData) {
        levelData.name = newName;
        newLevels[newName] = levelData;
        delete newLevels[oldName];
      }
      return newLevels;
    });
  };

  const deleteLevel = (id: string) => {
    setLevels((prev) => {
      const newLevels = { ...prev };
      delete newLevels[id];
      return newLevels;
    });
  };

  const levelNames = Object.keys(levels);

  return (
    <LevelStorageContext.Provider
      value={{
        levelNames,
        loadLevel,
        addLevel,
        renameLevel,
        deleteLevel,
      }}
    >
      {children}
    </LevelStorageContext.Provider>
  );
}
