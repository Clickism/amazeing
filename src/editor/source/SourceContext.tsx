import { createContext, useContext } from "react";
import type { LevelData } from "../../game/level.ts";

export type SourceAPI<T> = {
  name: string;

  source: T;
  setSource: (source: T) => void;

  loadSource(): T | null;
  saveSource(content: T): void;
  renameSource(newTitle: string): void;
  deleteSource(): void;

  sourceNames?: string[];
  switchSource?(name: string): void;
  newSource?(): void;
};

export const FileSourceContext = createContext<SourceAPI<string> | null>(null);

export function useFileSource() {
  const ctx = useContext(FileSourceContext);
  if (!ctx) throw new Error("useFileSource must be used within a FileSourceProvider");
  return ctx;
}

export const LevelSourceContext = createContext<SourceAPI<LevelData> | null>(null);

export function useLevelSource() {
  const ctx = useContext(LevelSourceContext);
  if (!ctx) throw new Error("useLevelSource must be used within a LevelSourceProvider");
  return ctx;
}
