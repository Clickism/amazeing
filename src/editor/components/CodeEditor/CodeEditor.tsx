import styles from "./CodeEditor.module.css";
import clsx from "clsx";
import { CornerGroup } from "../../../components/CornerGroup/CornerGroup.tsx";
import ReactCodeMirror, { tooltips } from "@uiw/react-codemirror";
import { amazeing } from "../../../codemirror/amazeing.ts";
import { EditorView } from "@codemirror/view";
import { amazeingAutocomplete } from "../../../codemirror/autocomplete/autocomplete.ts";
import { useCodeEditorSettings } from "../../settings/CodeEditorSettingsContext.tsx";
import { useEditorTheme } from "../../../theme/EditorThemeContext.tsx";
import type { Extension } from "@codemirror/state";
import { TopBar, type TopBarProps } from "./TopBar/TopBar.tsx";

export type CodeEditorProps = {
  title?: string;
  code: string;
  setCode: (code: string) => void;
  editorExtensions?: Extension[];
  topBar?: TopBarProps;
};

export function CodeEditor({
  title,
  code,
  setCode,
  editorExtensions,
  topBar = {},
}: CodeEditorProps) {
  const { theme } = useEditorTheme();
  const { settings } = useCodeEditorSettings();
  return (
    <div
      className={clsx(
        styles.container,
        "window-border",
        theme.isLight ? "light-theme" : "dark-theme",
      )}
    >
      <CornerGroup position="top-right" className={styles.cornerGroup}>
        <TopBar title={title} {...topBar} />
      </CornerGroup>

      <ReactCodeMirror
        value={code}
        className={styles.codeEditor}
        height="100%"
        theme={theme.extension}
        extensions={[
          amazeing,
          amazeingAutocomplete,
          tooltips({
            position: "fixed",
            parent: document.getElementById("tooltip-root")!,
          }),
          ...(editorExtensions ?? []),
          // Make space for tabs
          EditorView.theme({
            ".cm-scroller": {
              paddingTop: "3rem",
            },
          }),
          EditorView.lineWrapping,
        ]}
        onChange={(value) => setCode(value)}
        basicSetup={{
          lineNumbers: true,
          searchKeymap: false,
        }}
        style={{
          fontSize: settings.fontSize,
          fontFamily: "JetBrains Mono, monospace",
        }}
      />

      <CornerGroup
        position="bottom-left"
        className={styles.bottomCornerGroup}
      />
    </div>
  );
}
