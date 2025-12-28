import styles from "./CodeEditor.module.css";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { CornerGroup } from "../../../components/CornerGroup/CornerGroup.tsx";
import { Button } from "../../../components/Button/Button.tsx";
import { ThemeSelect } from "./ThemeSelect/ThemeSelect.tsx";
import { VscSettings } from "react-icons/vsc";
import { FormField } from "../../../components/Form/FormField/FormField.tsx";
import { useTranslation } from "react-i18next";
import { FormGroup } from "../../../components/Form/FormGroup/FormGroup.tsx";
import ReactCodeMirror, { tooltips } from "@uiw/react-codemirror";
import { amazeing } from "../../../codemirror/amazeing.ts";
import { currentLineHighlighter } from "../../../codemirror/currentLineHighlighter.ts";
import { EditorView } from "@codemirror/view";
import { amazeingAutocomplete } from "../../../codemirror/autocomplete/autocomplete.ts";
import { FaRegFolderOpen } from "react-icons/fa6";
import { ActiveFile } from "./FileList/ActiveFile/ActiveFile.tsx";
import { FileList } from "./FileList/FileList.tsx";
import { useCodeEditorSettings } from "../../settings/CodeEditorSettingsContext.tsx";
import { useCodeStorage } from "../../storage/CodeStorageContext.tsx";
import { useEditorRuntime } from "../../runtime/EditorRuntimeContext.tsx";
import { useEditorTheme } from "../../../theme/EditorThemeContext.tsx";
import { Popover } from "../../../components/popup/Popover/Popover.tsx";

const AUTO_SAVE_INTERVAL = 5000; // ms

// TODO: Add error line state to CodeMirror
export type CodeEditorProps =
  | {
      tabbed?: false;
      fileName?: never;
      setFileName?: never;
    }
  | {
      tabbed: true;
      fileName: string;
      setFileName: (fileName: string | null) => void;
    };

export function CodeEditor({ tabbed, fileName, setFileName }: CodeEditorProps) {
  const { theme } = useEditorTheme();
  const { settings, setSettings } = useCodeEditorSettings();
  const { saveFile, loadFile } = useCodeStorage();
  const { t } = useTranslation();
  const { code, setCode, currentLine } = useEditorRuntime();

  const [filesOpen, setFilesOpen] = useState(false);

  // Code refs for saving
  const savedCodeRef = useRef<string | null>(
    tabbed ? loadFile(fileName)?.content : null,
  );
  const codeRef = useRef(code);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // Load code from localStorage
  useEffect(() => {
    if (!fileName) return;
    const file = loadFile(fileName);
    if (!file) return;
    setCode(file.content);
  }, [fileName, loadFile, setCode]);

  // Auto-save
  useEffect(() => {
    if (!fileName) return;
    const interval = setInterval(() => {
      if (codeRef.current === savedCodeRef.current) return;
      savedCodeRef.current = codeRef.current;
      saveFile({ name: fileName, content: codeRef.current });
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [fileName, saveFile]);

  // Save on close
  useEffect(() => {
    if (!fileName) return;
    const handleBeforeUnload = () => {
      if (codeRef.current === savedCodeRef.current) return;
      saveFile({ name: fileName, content: codeRef.current });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [fileName, saveFile]);

  return (
    <div
      className={clsx(
        styles.container,
        "window-border",
        theme.isLight ? "light-theme" : "dark-theme",
      )}
    >
      <CornerGroup
        position="top-right"
        className={clsx(styles.cornerGroup, styles.blur)}
      >
        {tabbed && <ActiveFile activeFile={fileName ?? "Untitled"} />}
        <div style={{ flex: 1 }} />
        <Button onClick={() => setFilesOpen((prev) => !prev)}>
          {filesOpen ? <FaRegFolderOpen /> : <FaRegFolderOpen />}
          {t("codeEditor.files")}
        </Button>
        <Popover
          title={t("codeEditor.settings")}
          trigger={
            <Button shape="icon" className={styles.settingsButton}>
              <VscSettings size={20} />
            </Button>
          }
          // position="left top"
        >
          <FormGroup>
            <FormField label={t("codeEditor.theme")}>
              <ThemeSelect />
            </FormField>
            <FormField label={t("codeEditor.fontSize")}>
              <input
                type="number"
                min={8}
                max={32}
                defaultValue={settings.fontSize}
                onChange={(e) => {
                  const size = Number(e.target.value);
                  setSettings({
                    ...settings,
                    fontSize: size,
                  });
                }}
              />
            </FormField>
          </FormGroup>
        </Popover>
      </CornerGroup>

      <ReactCodeMirror
        key={fileName ?? "single-editor"}
        value={code}
        className={styles.codeEditor}
        height="100%"
        theme={theme.extension}
        extensions={[
          amazeing,
          amazeingAutocomplete,
          currentLineHighlighter(() => currentLine),
          tooltips({
            position: "fixed",
            parent: document.getElementById("tooltip-root")!,
          }),
          // Make space for tabs
          EditorView.theme({
            ".cm-scroller": tabbed
              ? {
                  paddingTop: "3rem",
                }
              : {},
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

      {tabbed && filesOpen && (
        <FileList
          activeFile={fileName ?? "Untitled"}
          setActiveFile={(newFileName, saveOld) => {
            // Save current file before switching
            if (fileName && saveOld) {
              saveFile({ name: fileName, content: code });
            }
            setFileName?.(newFileName);
          }}
        />
      )}
    </div>
  );
}
