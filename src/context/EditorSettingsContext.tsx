import { createContext, useContext } from "react";
import type { EditorTheme } from "../utils/editorThemes.ts";

export type EditorSettings = {
  editorTheme: EditorTheme;
  setEditorTheme: (theme: string) => void;
  refreshEditorTheme: () => void;

  fontSize: number;
  setFontSize: (size: number) => void;
};

export const EditorSettingsContext = createContext<EditorSettings | undefined>(
  undefined,
);

export function useEditorSettings() {
  const ctx = useContext(EditorSettingsContext);
  if (!ctx)
    throw new Error(
      "useEditorSettings must be used within EditorSettingsProvider",
    );
  return ctx;
}
