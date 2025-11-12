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
  const [files, setFiles] = useState<Record<string, CodeFile>>({});
  const fileNames = Object.keys(files);
  const storageKey = `editor:${fileNamespace}:files`;

  useEffect(() => {
    // Load files
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      setFiles(JSON.parse(raw));
    } catch {
      console.warn(`Couldn't load file data for ${fileNamespace}`);
      setFiles({});
    }
  }, [fileNamespace, storageKey]);

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

  return (
    <CodeStorageContext.Provider
      value={{
        fileNames,
        saveFile,
        loadFile,
        deleteFile,
        clearAll,
      }}
    >
      {children}
    </CodeStorageContext.Provider>
  );
}
