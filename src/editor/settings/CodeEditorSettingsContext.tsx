import { createContext, useContext } from "react";

export type CodeEditorSettings = {
  fontSize: number;
};

export type CodeEditorSettingsAPI = {
  settings: CodeEditorSettings;
  setSettings: (settings: Partial<CodeEditorSettings>) => void;
};

export const CodeEditorSettingsContext =
  createContext<CodeEditorSettingsAPI | null>(null);

export function useCodeEditorSettings() {
  const ctx = useContext(CodeEditorSettingsContext);
  if (!ctx)
    throw new Error(
      "useCodeEditorSettings must be used within CodeEditorSettingsProvider",
    );
  return ctx;
}
