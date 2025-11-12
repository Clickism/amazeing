import { createContext } from "react";
import type { EditorTheme } from "../utils/editorThemes.ts";

export type EditorSettings = {
  editorTheme: EditorTheme;
  setEditorTheme: (theme: string) => void;
  refreshEditorTheme: () => void;

  fontSize: number;
  setFontSize: (size: number) => void;
}

export const EditorSettingsContext = createContext<
  | EditorSettings
  | undefined
>(undefined);
