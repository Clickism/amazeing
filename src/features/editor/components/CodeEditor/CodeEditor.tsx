import styles from "./CodeEditor.module.css";
import clsx from "clsx";
import { CornerGroup } from "../../../../shared/components/CornerGroup/CornerGroup.tsx";
import ReactCodeMirror, { tooltips } from "@uiw/react-codemirror";
import { amazeing } from "../../../../core/amazeing/amazeing.ts";
import { EditorView } from "@codemirror/view";
import { amazeingAutocomplete } from "../../../../core/amazeing/autocomplete/autocomplete.ts";
import { useCodeEditorSettings } from "../../settings/CodeEditorSettingsContext.tsx";
import { useEditorTheme } from "../../../../shared/theme/EditorThemeContext.tsx";
import type { Extension } from "@codemirror/state";
import { TopBar, type TopBarProps } from "./TopBar/TopBar.tsx";
import type { CSSProperties } from "react";

export type CodeEditorProps = {
  title?: string;
  code: string;
  setCode: (code: string) => void;
  editorExtensions?: Extension[];
  topBar?: TopBarProps;
  transitionDuration: number;
};

export function CodeEditor({
  title,
  code,
  setCode,
  editorExtensions,
  topBar = {},
  transitionDuration,
}: CodeEditorProps) {
  const { theme } = useEditorTheme();
  const { settings } = useCodeEditorSettings();
  return (
    <div
      className={clsx(
        styles.container,
        theme.isLight ? "light-theme" : "dark-theme",
      )}
      style={
        {
          "--exec-line-transition-duration": `${transitionDuration}s`,
        } as CSSProperties
      }
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
