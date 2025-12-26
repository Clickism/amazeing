import { createContext, useContext } from "react";

export type EditorSettings = {
  instructionsPerSecond: number;
  isInstant: boolean;
};

export type EditorSettingsAPI = {
  settings: EditorSettings;
  setSettings: (settings: Partial<EditorSettings>) => void;
};

export const EditorSettingsContext = createContext<EditorSettingsAPI | null>(
  null,
);

export function useEditorSettings() {
  const ctx = useContext(EditorSettingsContext);
  if (!ctx) {
    throw new Error(
      "useEditorSettings must be used within EditorSettings context.",
    );
  }
  return ctx;
}
