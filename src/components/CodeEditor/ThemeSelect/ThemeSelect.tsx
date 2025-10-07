import {
  type EditorTheme,
  SUPPORTED_THEMES,
} from "../../../utils/editorTheme.ts";
import { camelToTitleCase } from "../../../utils/utils.ts";
import React from "react";

export function ThemeSelect({
  editorTheme,
  setEditorTheme,
}: {
  editorTheme: EditorTheme;
  setEditorTheme: (theme: string) => void;
}) {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditorTheme(e.target.value);
  };
  return (
    <select value={editorTheme.name} onChange={onChange}>
      {Object.keys(SUPPORTED_THEMES).map((key) => (
        <option key={key} value={key}>
          {camelToTitleCase(key)}
        </option>
      ))}
    </select>
  );
}
