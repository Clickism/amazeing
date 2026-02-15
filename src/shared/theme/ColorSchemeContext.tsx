import { createContext, useContext } from "react";

export type ColorScheme = "light" | "dark";

export type ColorSchemeContextType = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
};

export const ColorSchemeContext = createContext<ColorSchemeContextType | null>(
  null,
);

export function useColorScheme() {
  const ctx = useContext(ColorSchemeContext);
  if (!ctx) {
    throw new Error("useColorScheme must be used within a ColorSchemeProvider");
  }
  return ctx;
}
