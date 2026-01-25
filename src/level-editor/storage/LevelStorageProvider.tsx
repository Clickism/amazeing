import { LevelStorageContext } from "./LevelStorageContext.tsx";
import { type ReactNode, useCallback, useEffect } from "react";
import type { LevelData } from "../../game/level.ts";
import {
  usePersistentState,
  usePersistentStorage,
} from "../../utils/storage.ts";
import { useTranslation } from "react-i18next";
import { emptyLevelData } from "../state.ts";

type LevelStorageProviderProps = {
  fileNamespace: string;
  children: ReactNode;
};

export function LevelStorageProvider({
  children,
  fileNamespace,
}: LevelStorageProviderProps) {
  const { t } = useTranslation();
  const storage = usePersistentStorage(`levels:${fileNamespace}`);
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
    (level: LevelData) => {
      setLevels((prev) => ({
        ...prev,
        [level.name]: level,
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

  useEffect(() => {
    if (levelNames.length === 0) {
      saveLevel(
        emptyLevelData(
          t("levelStorage.newLevel.name", { num: 1 }),
          t("levelStorage.newLevel.description"),
        ),
      );
    }
  }, [levelNames.length, levels, saveLevel, t]);

  return (
    <LevelStorageContext.Provider
      value={{
        levelNames,
        loadLevel,
        saveLevel,
        renameLevel,
        deleteLevel,
      }}
    >
      {children}
    </LevelStorageContext.Provider>
  );
}
