import { type ReactNode, useEffect, useMemo } from "react";
import { type EditorTheme, getEditorTheme } from "./themes.ts";
import {
  EditorThemeContext,
  type EditorThemeContextType,
} from "./EditorThemeContext.tsx";
import { usePersistentState, usePersistentStorage } from "../utils/storage.ts";
import { useColorScheme } from "./ColorSchemeContext.tsx";

type EditorThemeProviderProps = {
  namespace: string;
  children: ReactNode;
};

export function EditorThemeProvider({
  children,
  namespace,
}: EditorThemeProviderProps) {
  const storage = usePersistentStorage(namespace);
  const [themeName, setThemeName] = usePersistentState<EditorTheme["name"]>(
    storage,
    "theme",
    "default",
  );
  const { colorScheme } = useColorScheme();
  const theme = useMemo(() => {
    return getEditorTheme(colorScheme, themeName);
  }, [colorScheme, themeName]);

  useEffect(() => {
    const tooltipRoot = document.getElementById("tooltip-root");
    if (!tooltipRoot) return;
    tooltipRoot.className = theme.isLight ? "light-theme" : "dark-theme";
  }, [theme.isLight]);

  const value: EditorThemeContextType = { theme, setTheme: setThemeName };
  return (
    <EditorThemeContext.Provider value={value}>
      {children}
    </EditorThemeContext.Provider>
  );
}
