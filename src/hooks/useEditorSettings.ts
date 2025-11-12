import { useContext } from "react";
import { EditorSettingsContext } from "../context/EditorSettingsContext.tsx";

export function useEditorSettings() {
  const ctx = useContext(EditorSettingsContext);
  if (!ctx)
    throw new Error("useEditorSettings must be used within EditorSettingsProvider");
  return ctx;
}
