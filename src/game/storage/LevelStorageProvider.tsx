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

  const addLevel = (level: LevelData) => {
    setLevels((prev) => ({
      ...prev,
      [level.name]: level,
    }));
  };

  const deleteLevel = (id: string) => {
    setLevels((prev) => {
      const newLevels = { ...prev };
      delete newLevels[id];
      return newLevels;
    });
  };

  return (
    <LevelStorageContext.Provider
      value={{
        levels: Object.values(levels),
        addLevel,
        deleteLevel,
      }}
    >
      {children}
    </LevelStorageContext.Provider>
  );
}
