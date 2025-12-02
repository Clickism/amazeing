import { type ReactNode, useEffect, useState } from "react";
import {
  type EditorTheme,
  getDefaultEditorTheme,
  getEditorTheme,
} from "../utils/editorThemes.ts";
import { EditorSettingsContext } from "./EditorSettingsContext.tsx";

const NAMESPACE = "editor:";

function loadNumber(key: string, defaultValue: number): number {
  const storedValue = localStorage.getItem(NAMESPACE + key);
  return storedValue ? Number(storedValue) : defaultValue;
}

function loadTheme(key: string): EditorTheme {
  const themeName = localStorage.getItem(NAMESPACE + key);
  if (themeName === null) {
    return getDefaultEditorTheme();
  }
  return getEditorTheme(themeName);
}

function save(key: string, value: string) {
  localStorage.setItem(NAMESPACE + key, value);
}

function clear(key: string) {
  localStorage.removeItem(NAMESPACE + key);
}

export function EditorSettingsProvider({ children }: { children: ReactNode }) {
  const [editorTheme, setEditorThemeState] = useState<EditorTheme>(
    loadTheme("theme"),
  );
  const [fontSize, setFontSizeState] = useState<number>(
    loadNumber("fontSize", 16),
  );

  const setEditorTheme = (themeName: string) => {
    const theme = getEditorTheme(themeName);
    setEditorThemeState(theme);
    if (theme.name === "default") {
      clear("theme");
      return;
    }
    save("theme", theme.name);
  };

  const refreshEditorTheme = () => {
    setEditorThemeState(loadTheme("theme"));
  };

  const setFontSize = (size: number) => {
    save("fontSize", size.toString());
    setFontSizeState(size);
  };

  useEffect(() => {
    // Set tooltip font size
    document.getElementById("tooltip-root")!.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    document.getElementById("tooltip-root")!.className = editorTheme.isLight ? "light-theme" : "dark-theme";
  }, [editorTheme]);

  return (
    <EditorSettingsContext.Provider
      value={{
        editorTheme,
        setEditorTheme,
        refreshEditorTheme,
        fontSize,
        setFontSize,
      }}
    >
      {children}
    </EditorSettingsContext.Provider>
  );
}
