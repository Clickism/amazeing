import { type ReactNode, useCallback } from "react";
import { CodeStorageContext } from "./CodeStorageContext.tsx";
import {
  usePersistentState,
  usePersistentStorage,
} from "../../../shared/utils/storage.ts";

type CodeFile = {
  name: string;
  content: string;
};

type ProviderProps = {
  fileNamespace: string;
  children: ReactNode;
};

export function CodeStorageProvider({
  fileNamespace,
  children,
}: ProviderProps) {
  const storage = usePersistentStorage(fileNamespace);
  const [files, setFiles] = usePersistentState<Record<string, CodeFile>>(
    storage,
    "files",
    {},
  );
  const fileNames = Object.keys(files);

  const saveFile = useCallback(
    (name: string, content: string) => {
      setFiles((prev) => ({
        ...prev,
        [name]: { name, content },
      }));
    },
    [setFiles],
  );

  const loadFile = useCallback(
    (name: string): string | null => {
      return files[name]?.content ?? null;
    },
    [files],
  );

  const deleteFile = useCallback(
    (name: string) => {
      setFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[name];
        return newFiles;
      });
    },
    [setFiles],
  );

  const renameFile = useCallback(
    (oldName: string, newName: string) => {
      setFiles((prev) => {
        const newFiles = { ...prev };
        const oldFile = newFiles[oldName];
        if (newFiles[newName]) {
          // Prevent overwriting existing file
          return newFiles;
        }
        if (oldFile) {
          newFiles[newName] = {
            name: newName,
            content: oldFile.content,
          };
          delete newFiles[oldName];
        }
        return newFiles;
      });
    },
    [setFiles],
  );

  return (
    <CodeStorageContext.Provider
      value={{
        fileNames,
        saveFile,
        loadFile,
        deleteFile,
        renameFile,
        fileNamespace,
      }}
    >
      {children}
    </CodeStorageContext.Provider>
  );
}
