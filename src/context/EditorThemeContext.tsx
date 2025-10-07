import { createContext } from "react";
import type { EditorTheme } from "../utils/editorTheme.ts";

export const EditorThemeContext = createContext<
  | {
      editorTheme: EditorTheme;
      setEditorTheme: (theme: string) => void;
      refreshEditorTheme: () => void;
    }
  | undefined
>(undefined);
