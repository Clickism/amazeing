import { type PrismTheme, themes } from "prism-react-renderer";
import { getTheme } from "./themes.ts";

const DEFAULT_LIGHT_THEME: PrismTheme = themes.github;
const DEFAULT_DARK_THEME: PrismTheme = themes.vsDark;

const SUPPORTED_THEMES = {
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
  synthwave84: themes.synthwave84,
  ultramin: themes.ultramin,
  vsDark: themes.vsDark,
  vsLight: themes.vsLight,
};

export function setEditorTheme(theme: string) {
  localStorage.setItem("colorTheme", theme);
}

export function getEditorTheme(): PrismTheme {
  const themeName = localStorage.getItem("theme");
  if (themeName === null || !(themeName in SUPPORTED_THEMES)) {
    return getDefaultEditorTheme();
  }
  return SUPPORTED_THEMES[
    themeName as keyof typeof SUPPORTED_THEMES
    ] as PrismTheme;
}

export function getDefaultEditorTheme(): PrismTheme {
  const theme = getTheme();
  return theme === "dark" ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
}
