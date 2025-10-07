import { type PrismTheme, themes } from "prism-react-renderer";
import { getTheme } from "./themes.ts";

const DEFAULT_LIGHT_THEME: EditorTheme = { ...themes.github, name: "github" };
const DEFAULT_DARK_THEME: EditorTheme = { ...themes.vsDark, name: "vsDark" };

export const SUPPORTED_THEMES = {
  dracula: themes.dracula,
  duotoneDark: themes.duotoneDark,
  duotoneLight: themes.duotoneLight,
  github: themes.github,
  gruvboxMaterialDark: themes.gruvboxMaterialDark,
  gruvboxMaterialLight: themes.gruvboxMaterialLight,
  jettwaveDark: themes.jettwaveDark,
  jettwaveLight: themes.jettwaveLight,
  nightOwl: themes.nightOwl,
  nightOwlLight: themes.nightOwlLight,
  oceanicNext: themes.oceanicNext,
  okaidia: themes.okaidia,
  oneDark: themes.oneDark,
  oneLight: themes.oneLight,
  palenight: themes.palenight,
  shadesOfPurple: themes.shadesOfPurple,
  // synthwave84: themes.synthwave84,
  ultramin: themes.ultramin,
  vsDark: themes.vsDark,
  vsLight: themes.vsLight,
};

export type EditorTheme = PrismTheme & { name: string };

export function setEditorTheme(theme: string) {
  localStorage.setItem("colorTheme", theme);
}

export function getEditorTheme(): EditorTheme {
  const themeName = localStorage.getItem("colorTheme");
  if (themeName === null || !(themeName in SUPPORTED_THEMES)) {
    return getDefaultEditorTheme();
  }
  const theme = SUPPORTED_THEMES[
    themeName as keyof typeof SUPPORTED_THEMES
  ] as PrismTheme;
  return { ...theme, name: themeName };
}

export function getDefaultEditorTheme(): EditorTheme {
  const theme = getTheme();
  return theme === "dark" ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
}
