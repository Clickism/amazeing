import { type ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LevelSourceContext } from "./SourceContext.tsx";
import type { LevelData } from "../../game/level.ts";
import { useLevelStorage } from "../../level-editor/storage/LevelStorageContext.tsx";
import { useSourceApi } from "./SourceProvider.tsx";
import { findNextAvailableName } from "../utils.ts";
import { emptyLevelData } from "../../level-editor/state.ts";

type LevelSourceProviderProps = {
  // Should be stable
  level: LevelData;
  setLevel: (level: LevelData) => void;
  children?: ReactNode;
};

export function LevelSourceProvider({
  level,
  setLevel,
  children,
}: LevelSourceProviderProps) {
  const { t } = useTranslation();
  const {
    levelNames,
    loadLevel,
    saveLevel,
    deleteLevel,
    renameLevel,
    fileNamespace,
  } = useLevelStorage();
  const fileStorage = useMemo(
    () => ({
      fileNames: levelNames,
      loadFile: loadLevel,
      saveFile: saveLevel,
      deleteFile: deleteLevel,
      renameFile: renameLevel,
    }),
    [deleteLevel, levelNames, loadLevel, renameLevel, saveLevel],
  );
  const sourceApi = useSourceApi<LevelData>({
    source: level,
    setSource: setLevel,
    storageNamespace: fileNamespace,
    createNewSource: () => {
      const name = findNextAvailableName(
        (i) => t("levelStorage.newLevel.name", { num: i }),
        levelNames,
      );
      const content = emptyLevelData();
      return { name, content };
    },
    fileStorage,
  });

  return (
    <LevelSourceContext.Provider value={sourceApi}>
      {children}
    </LevelSourceContext.Provider>
  );
}
