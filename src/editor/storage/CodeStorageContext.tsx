import { createContext, useContext } from "react";

export type CodeFile = {
  name: string;
  content: string;
};

type CodeStorage = {
  fileNames: string[];
  saveFile: (file: CodeFile) => void;
  loadFile: (name: string) => CodeFile | null;
  deleteFile: (name: string) => void;
  renameFile: (oldName: string, newName: string) => void;
  clearAll: () => void;
  setActiveFile: (name: string) => void;
  getActiveFile: () => string | null;
};

export const CodeStorageContext = createContext<CodeStorage | null>(null);

export function useCodeStorage() {
  const ctx = useContext(CodeStorageContext);
  if (!ctx)
    throw new Error("useCodeStorage must be used within CodeStorageProvider");
  return ctx;
}
