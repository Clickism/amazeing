// import { type PrismTheme, themes } from "prism-react-renderer";
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

export type EditorTheme = { extension: Extension; name: string };

export function setEditorTheme(theme: string) {
  if (theme === "default") {
    localStorage.removeItem("colorTheme");
    return;
  }
  localStorage.setItem("colorTheme", theme);
}

export function getEditorTheme(): EditorTheme {
  const themeName = localStorage.getItem("colorTheme");
  if (themeName === null || !(themeName in SUPPORTED_THEMES)) {
    return getDefaultEditorTheme();
  }
  const theme = SUPPORTED_THEMES[
    themeName as keyof typeof SUPPORTED_THEMES
  ] as Extension;
  return { extension: theme, name: themeName };
}

export function getDefaultEditorTheme(): EditorTheme {
  const theme = getTheme();
  return theme === "dark" ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
}
