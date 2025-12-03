import { getTheme } from "./themes.ts";
import type { Extension } from "@codemirror/state";

import {
  androidstudio,
  atomone,
  aura,
  bbedit,
  bespin,
  darcula,
  defaultSettingsGithubDark,
  dracula,
  duotoneDark,
  duotoneLight,
  eclipse,
  githubDarkInit,
  githubLightInit,
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
import { tags as t } from "@lezer/highlight";

// Replicate Typst colors
const modifiedGithubLight = githubLightInit({
  styles: [
    {
      tag: [t.function(t.variableName), t.function(t.propertyName)],
      color: "#1d6c76",
    },
    {
      tag: t.number,
      color: "#b60157"
    }
  ],
});

const modifiedGithubDark = githubDarkInit({
  settings: {
    gutterBackground: defaultSettingsGithubDark.background,
    gutterForeground: "#606060",
  },
  styles: [
    {
      tag: [t.function(t.variableName), t.function(t.propertyName)],
      color: "#64abb2",
    },
    {
      tag: t.number,
      color: "#ff79a8"
    }
  ],
});

const DEFAULT_LIGHT_THEME: EditorTheme = {
  extension: modifiedGithubLight,
  name: "default",
  isLight: true,
};
const DEFAULT_DARK_THEME: EditorTheme = {
  extension: modifiedGithubDark,
  name: "default",
};

export const SUPPORTED_THEMES: Record<string, Extension> = {
  default: modifiedGithubDark,
  githubDark: modifiedGithubDark,
  githubLight: modifiedGithubLight,
  vscodeDark,
  vscodeLight,
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
