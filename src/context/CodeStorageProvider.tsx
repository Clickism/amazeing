import { useCallback, useEffect, useState } from "react";
import { type CodeFile, CodeStorageContext } from "./CodeStorageContext.tsx";

type ProviderProps = {
  fileNamespace: string;
  children: React.ReactNode;
};

export function CodeStorageProvider({
  fileNamespace,
  children,
}: ProviderProps) {
  const storageKey = `editor:${fileNamespace}:files`;
  const [files, setFiles] = useState<Record<string, CodeFile>>(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      console.warn(`Couldn't parse file data for ${fileNamespace}`);
      return {};
    }
  });
  const fileNames = Object.keys(files);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(files));
  }, [files, storageKey]);

  const saveFile = useCallback(({ name, content }: CodeFile) => {
    setFiles((prev) => ({
      ...prev,
      [name]: { name, content },
    }));
  }, []);

  const loadFile = useCallback(
    (name: string): CodeFile | null => {
      return files[name] ?? null;
    },
    [files],
  );

  const deleteFile = useCallback((name: string) => {
    setFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[name];
      return newFiles;
    });
  }, []);

  const clearAll = useCallback(() => {
    setFiles({});
  }, []);

  const renameFile = useCallback((oldName: string, newName: string) => {
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
  }, []);

  return (
    <CodeStorageContext.Provider
      value={{
        fileNames,
        saveFile,
        loadFile,
        deleteFile,
        renameFile,
        clearAll,
      }}
    >
      {children}
    </CodeStorageContext.Provider>
  );
}
