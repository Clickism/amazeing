import { LevelStorageContext } from "./LevelStorageContext.tsx";
import { type ReactNode, useCallback } from "react";
import type { LevelData } from "../../game/level.ts";
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
  const storage = usePersistentStorage(fileNamespace);
  const [levels, setLevels] = usePersistentState<Record<string, LevelData>>(
    storage,
    "levels",
    {},
  );

  const loadLevel = useCallback(
    (name: string): LevelData | null => {
      return levels[name] || null;
    },
    [levels],
  );

  const saveLevel = useCallback(
    (name: string, level: LevelData) => {
      setLevels((prev) => ({
        ...prev,
        [name]: level,
      }));
    },
    [setLevels],
  );

  const renameLevel = useCallback(
    (oldName: string, newName: string) => {
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
    },
    [setLevels],
  );

  const deleteLevel = useCallback(
    (id: string) => {
      setLevels((prev) => {
        const newLevels = { ...prev };
        delete newLevels[id];
        return newLevels;
      });
    },
    [setLevels],
  );

  const levelNames = Object.keys(levels);

  return (
    <LevelStorageContext.Provider
      value={{
        levelNames,
        loadLevel,
        saveLevel,
        renameLevel,
        deleteLevel,
        fileNamespace,
      }}
    >
      {children}
    </LevelStorageContext.Provider>
  );
}
