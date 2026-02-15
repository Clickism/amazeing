import { type ReactNode, useEffect } from "react";
import { type ColorScheme, ColorSchemeContext } from "./ColorSchemeContext.tsx";
import { usePersistentState, usePersistentStorage } from "../utils/storage.ts";

export const DEFAULT_COLOR_SCHEME = "dark";

type ColorSchemeProviderProps = {
  namespace: string;
  children: ReactNode;
};

export function ColorSchemeProvider({
  namespace,
  children,
}: ColorSchemeProviderProps) {
  const storage = usePersistentStorage(namespace);
  const [colorScheme, setColorScheme] = usePersistentState<ColorScheme>(
    storage,
    "color-scheme",
    DEFAULT_COLOR_SCHEME,
  );
  useEffect(() => {
    document.documentElement.setAttribute("theme", colorScheme);
  }, [colorScheme]);
  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
}
