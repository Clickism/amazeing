import { createContext, useContext } from "react";

type CodeStorage = {
  fileNames: string[];
  saveFile: (name: string, code: string) => void;
  loadFile: (name: string) => string | null;
  deleteFile: (name: string) => void;
  renameFile: (oldName: string, newName: string) => void;
  fileNamespace: string;
};

export const CodeStorageContext = createContext<CodeStorage | null>(null);

export function useCodeStorage() {
  const ctx = useContext(CodeStorageContext);
  if (!ctx)
    throw new Error("useCodeStorage must be used within CodeStorageProvider");
  return ctx;
}
