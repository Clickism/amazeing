import type { ReactNode } from "react";
import { type ColorScheme, ColorSchemeContext } from "./ColorSchemeContext.tsx";
import { usePersistentState, usePersistentStorage } from "../utils/storage.ts";

export const DEFAULT_COLOR_SCHEME = "light";

type ColorSchemeProviderProps = {
  namespace: string;
  children: ReactNode;
};

export function ColorSchemeProvider({
  namespace,
  children,
}: ColorSchemeProviderProps) {
  const storage = usePersistentStorage(namespace);
  const [colorScheme, setColorSchemeState] = usePersistentState<ColorScheme>(
    storage,
    "color-scheme",
    DEFAULT_COLOR_SCHEME,
  );
  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    document.documentElement.setAttribute("theme", scheme);
  };
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
