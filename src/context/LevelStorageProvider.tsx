import { LevelStorageContext } from "./LevelStorageContext.tsx";
import { type ReactNode, useEffect, useState } from "react";
import type { LevelData } from "../game/level.ts";

type LevelStorageProviderProps = {
  fileNamespace: string;
  children: ReactNode;
};

export function LevelStorageProvider({
  children,
  fileNamespace,
}: LevelStorageProviderProps) {
  const storageKey = `levels:${fileNamespace}`;
  const levelsStorageKey = `${storageKey}:levels`;
  const [levels, setLevels] = useState<Record<string, LevelData>>(() => {
    const raw = localStorage.getItem(levelsStorageKey);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      console.warn(`Couldn't parse level data for ${fileNamespace}`);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(levelsStorageKey, JSON.stringify(levels));
  }, [levels, levelsStorageKey]);

  const getAllLevels = () => Object.values(levels);
  const getAllLevelIds = () => Object.keys(levels).map((id) => Number(id));
  const getLevelById = (id: string) => levels[id];

  const addLevel = (level: LevelData) => {
    setLevels((prev) => ({
      ...prev,
      [level.id]: level,
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
        getAllLevels,
        getAllLevelIds,
        getLevelById,
        addLevel,
        deleteLevel,
      }}
    >
      {children}
    </LevelStorageContext.Provider>
  );
}
