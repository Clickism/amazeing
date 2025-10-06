import { type ReactNode, useState } from "react";
import type { PrismTheme } from "prism-react-renderer";
import {
  getEditorTheme as getStoredTheme,
  setEditorTheme as saveTheme,
} from "../utils/editorTheme.ts";
import { EditorThemeContext } from "./EditorThemeContext.tsx";

export function EditorThemeProvider({ children }: { children: ReactNode }) {
  const [editorTheme, setEditorThemeState] =
    useState<PrismTheme>(getStoredTheme);

  const setEditorTheme = (theme: string) => {
    saveTheme(theme);
    setEditorThemeState(getStoredTheme());
  };

  const refreshEditorTheme = () => {
    setEditorThemeState(getStoredTheme());
  };

  return (
    <EditorThemeContext.Provider
      value={{ editorTheme, setEditorTheme, refreshEditorTheme }}
    >
      {children}
    </EditorThemeContext.Provider>
  );
}
