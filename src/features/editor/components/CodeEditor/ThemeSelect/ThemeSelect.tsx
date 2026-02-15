import { camelToTitleCase } from "../../../../../shared/utils/utils.ts";
import React from "react";
import { SUPPORTED_THEMES } from "../../../../../shared/theme/themes.ts";
import { useEditorTheme } from "../../../../../shared/theme/EditorThemeContext.tsx";

export function ThemeSelect() {
  const { theme, setTheme } = useEditorTheme();
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };
  return (
    <select value={theme.name} onChange={onChange}>
      {Object.keys(SUPPORTED_THEMES).map((key) => (
        <option key={key} value={key}>
          {camelToTitleCase(key)}
        </option>
      ))}
    </select>
  );
}
