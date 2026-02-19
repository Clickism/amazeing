import styles from "./CodeEditor.module.css";
import clsx from "clsx";
import { CornerGroup } from "../../../../shared/components/CornerGroup/CornerGroup.tsx";
import ReactCodeMirror, { tooltips } from "@uiw/react-codemirror";
import { amazeing } from "../../../../core/amazeing/amazeing.ts";
import { EditorView } from "@codemirror/view";
import { amazeingAutocomplete } from "../../../../core/amazeing/autocomplete/autocomplete.ts";
import { useCodeEditorSettings } from "../../context/settings/CodeEditorSettingsContext.tsx";
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
  transitionDuration?: number;
  blurEffects?: boolean;
  settingsButton?: boolean;
  showTopBar?: boolean;
  autocomplete?: boolean;
};

export function CodeEditor({
  title,
  code,
  setCode,
  editorExtensions,
  topBar = {},
  transitionDuration = 0,
  blurEffects = true,
  settingsButton = true,
  showTopBar = true,
  autocomplete = true,
}: CodeEditorProps) {
  const { theme } = useEditorTheme();
  const { settings } = useCodeEditorSettings();

  return (
    <div
      className={clsx(
        styles.container,
        blurEffects && styles.blurEffects,
        theme.isLight ? "light-theme" : "dark-theme",
      )}
      style={
        {
          "--exec-line-transition-duration": `${transitionDuration}s`,
        } as CSSProperties
      }
    >
      {showTopBar && (
        <CornerGroup position="top-right" className={styles.cornerGroup}>
          <TopBar title={title} settingsButton={settingsButton} {...topBar} />
        </CornerGroup>
      )}

      <ReactCodeMirror
        value={code}
        className={styles.codeEditor}
        height="100%"
        theme={theme.extension}
        extensions={[
          amazeing,
          autocomplete ? amazeingAutocomplete : [],
          tooltips({
            position: "fixed",
            parent: document.getElementById("tooltip-root")!,
          }),
          ...(editorExtensions ?? []),
          // Make space for tabs
          EditorView.theme({
            ".cm-scroller": {
              paddingTop: showTopBar ? "3rem" : null,
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
