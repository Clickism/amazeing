import { FileSourceContext } from "./SourceContext.tsx";
import { type ReactNode } from "react";
import { useCodeStorage } from "../storage/CodeStorageContext.tsx";
import { useTranslation } from "react-i18next";
import { findNextAvailableName } from "../utils.ts";
import { useSourceApi } from "./SourceProvider.tsx";

type FileSourceProviderProps = {
  // Should be stable
  code: string;
  setCode: (code: string) => void;
  children?: ReactNode;
};

export function FileSourceProvider({
  code,
  setCode,
  children,
}: FileSourceProviderProps) {
  const { t } = useTranslation();
  const {
    fileNames,
    loadFile,
    saveFile,
    deleteFile,
    renameFile,
    fileNamespace,
  } = useCodeStorage();
  const sourceApi = useSourceApi<string>({
    source: code,
    setSource: setCode,
    storageNamespace: fileNamespace,
    createNewSource: () => {
      const name = findNextAvailableName(
        (i) => t("codeStorage.newFile.name", { num: i }),
        fileNames,
      );
      const content = t("codeStorage.newFile.content");
      return { name, content };
    },
    fileStorage: {
      fileNames,
      loadFile,
      saveFile,
      deleteFile,
      renameFile,
    },
  });

  return (
    <FileSourceContext.Provider value={sourceApi}>
      {children}
    </FileSourceContext.Provider>
  );
}
