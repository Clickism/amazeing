import { useContext } from "react";
import { EditorThemeContext } from "../context/EditorThemeContext.tsx";

export function useEditorTheme() {
  const ctx = useContext(EditorThemeContext);
  if (!ctx)
    throw new Error("useEditorTheme must be used within EditorThemeProvider");
  return ctx;
}
