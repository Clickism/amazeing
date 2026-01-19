import { createContext, useContext } from "react";

type SourceAPI = {
  name: string;
  loadSource(): string | null;
  saveSource(content: string): void;
  renameSource(newTitle: string): void;
  deleteSource(): void;

  sourceNames?: string[];
  switchSource?(name: string): void;
};

export const SourceContext = createContext<SourceAPI | null>(null);

export function useSource() {
  const ctx = useContext(SourceContext);
  if (!ctx) throw new Error("useSource must be used within a source provider");
  return ctx;
}
