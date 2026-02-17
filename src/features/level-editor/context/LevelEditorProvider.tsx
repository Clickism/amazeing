import { type PropsWithChildren } from "react";
import { LevelEditorContext } from "./LevelEditorContext";
import type { LevelData } from "../../../core/game/level.ts";
import { emptyLevelData } from "../state.ts";
import { useMultiSource } from "../../editor/context/source/useMultiSource.ts";
import { useFileStorage } from "../../editor/context/storage/useFileStorage.ts";
import { useTranslation } from "react-i18next";

type LevelEditorProviderProps = {
  namespace: string;
};

export function LevelEditorProvider({
  namespace,
  children,
}: PropsWithChildren<LevelEditorProviderProps>) {
  const { t } = useTranslation();
  const fileStorage = useFileStorage<LevelData>(namespace);
  const source = useMultiSource<LevelData>({
    defaultData: emptyLevelData(),
    fileStorage,
    fileNameFormat: (num) => t("levelStorage.newLevel.name", { num }),
  });
  return (
    <LevelEditorContext.Provider
      value={{
        level: source.activeSource.data,
        setLevel: source.activeSource.setData,
        source,
      }}
    >
      {children}
    </LevelEditorContext.Provider>
  );
}
