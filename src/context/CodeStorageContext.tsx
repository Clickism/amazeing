import { createContext } from "react";

export type CodeFile = {
  name: string;
  content: string;
};

export const CodeStorageContext = createContext<
  | {
      fileNames: string[];
      saveFile: (file: CodeFile) => void;
      loadFile: (name: string) => CodeFile | null;
      deleteFile: (name: string) => void;
      renameFile: (oldName: string, newName: string) => void;
      clearAll: () => void;
    }
  | undefined
>(undefined);
