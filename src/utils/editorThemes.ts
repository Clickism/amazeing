import { getTheme } from "./themes.ts";
import type { Extension } from "@codemirror/state";

import {
  androidstudio,
  atomone,
  aura,
  bbedit,
  bespin,
  darcula,
  dracula,
  duotoneDark,
  duotoneLight,
  eclipse,
  githubDark,
  githubLight,
  gruvboxDark,
  gruvboxLight,
  kimbie,
  materialDark,
  materialLight,
  monokai,
  nord,
  okaidia,
  quietlight,
  red,
  solarizedDark,
  solarizedLight,
  sublime,
  tokyoNight,
  tomorrowNightBlue,
  vscodeDark,
  vscodeLight,
  xcodeDark,
  xcodeLight,
} from "@uiw/codemirror-themes-all";
import { oneDark } from "@codemirror/theme-one-dark";

const DEFAULT_LIGHT_THEME: EditorTheme = {
  extension: githubLight,
  name: "default",
  isLight: true,
};
const DEFAULT_DARK_THEME: EditorTheme = {
  extension: vscodeDark,
  name: "default",
};

export const SUPPORTED_THEMES: Record<string, Extension> = {
  default: vscodeDark,
  vscodeDark,
  vscodeLight,
  githubDark,
  githubLight,
  androidstudio,
  atomone,
  aura,
  bbedit,
  bespin,
  darcula,
  dracula,
  duotoneDark,
  duotoneLight,
  eclipse,
  gruvboxDark,
  gruvboxLight,
  kimbie,
  materialDark,
  materialLight,
  monokai,
  nord,
  okaidia,
  quietlight,
  red,
  solarizedDark,
  solarizedLight,
  sublime,
  tokyoNight,
  tomorrowNightBlue,
  xcodeDark,
  xcodeLight,
  oneDark,
};

const LIGHT_THEMES: Record<string, boolean> = {
  vscodeLight: true,
  githubLight: true,
  bbedit: true,
  duotoneLight: true,
  eclipse: true,
  gruvboxLight: true,
  materialLight: true,
  quietlight: true,
  solarizedLight: true,
  xcodeLight: true,
};

export type EditorTheme = {
  extension: Extension;
  name: string;
  isLight?: boolean;
};

export function getEditorTheme(themeName: string): EditorTheme {
  if (themeName === "default" || !(themeName in SUPPORTED_THEMES)) {
    return getDefaultEditorTheme();
  }
  const theme = SUPPORTED_THEMES[
    themeName as keyof typeof SUPPORTED_THEMES
  ] as Extension;
  return {
    extension: theme,
    name: themeName,
    isLight: themeName in LIGHT_THEMES,
  };
}

export function getDefaultEditorTheme(): EditorTheme {
  const theme = getTheme();
  return theme === "dark" ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
}
