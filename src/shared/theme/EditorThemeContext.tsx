import { createContext, useContext } from "react";
import type { EditorTheme } from "./themes.ts";

export type EditorThemeContextType = {
  theme: EditorTheme;
  setTheme: (themeName: EditorTheme["name"]) => void;
};

export const EditorThemeContext = createContext<EditorThemeContextType | null>(
  null,
);

export function useEditorTheme() {
  const ctx = useContext(EditorThemeContext);
  if (!ctx) {
    throw new Error(
      "useEditorTheme must be used within an EditorThemeProvider",
    );
  }
  return ctx;
}
