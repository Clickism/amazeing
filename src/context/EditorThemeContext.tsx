import { createContext } from "react";
import { type PrismTheme } from "prism-react-renderer";

export const EditorThemeContext = createContext<
  | {
      editorTheme: PrismTheme;
      setEditorTheme: (theme: string) => void;
      refreshEditorTheme: () => void;
    }
  | undefined
>(undefined);
