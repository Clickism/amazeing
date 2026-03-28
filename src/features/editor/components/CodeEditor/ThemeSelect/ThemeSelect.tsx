import { camelToTitleCase } from "../../../../../shared/utils/utils.ts";
import React from "react";
import {
  isLightTheme,
  SUPPORTED_THEMES,
} from "../../../../../shared/theme/themes.ts";
import { useEditorTheme } from "../../../../../shared/theme/EditorThemeContext.tsx";

export function ThemeSelect() {
  const { theme, setTheme } = useEditorTheme();
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const defaultThemes = ["default", "githubDark", "githubLight"];

  const darkThemes = Object.keys(SUPPORTED_THEMES).filter(
    (theme) => !defaultThemes.includes(theme) && !isLightTheme(theme),
  );

  const lightThemes = Object.keys(SUPPORTED_THEMES).filter(
    (theme) => !defaultThemes.includes(theme) && isLightTheme(theme),
  );

  return (
    <select value={theme.name} onChange={onChange}>
      <optgroup label="Default">
        {defaultThemes.map((key) => (
          <option key={key} value={key}>
            {camelToTitleCase(key)}
          </option>
        ))}
      </optgroup>
      <optgroup label="Dark">
        {darkThemes.map((key) => (
          <option key={key} value={key}>
            {camelToTitleCase(key)}
          </option>
        ))}
      </optgroup>
      <optgroup label="Light">
        {lightThemes.map((key) => (
          <option key={key} value={key}>
            {camelToTitleCase(key)}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
