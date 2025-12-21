import styles from "./CodeEditor.module.css";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useEditorSettings } from "../../hooks/useEditorSettings.ts";
import { CornerGroup } from "../ui/CornerGroup/CornerGroup.tsx";
import { Button } from "../ui/Button/Button.tsx";
import Popup from "reactjs-popup";
import { ThemeSelect } from "./ThemeSelect/ThemeSelect.tsx";
import { VscSettings } from "react-icons/vsc";
import { FormField } from "../ui/Form/FormField/FormField.tsx";
import { useTranslation } from "react-i18next";
import { FormGroup } from "../ui/Form/FormGroup/FormGroup.tsx";
import ReactCodeMirror, { tooltips } from "@uiw/react-codemirror";
import { amazeing } from "../../codemirror/amazeing.ts";
import { currentLineHighlighter } from "../../codemirror/currentLineHighlighter.ts";
import { EditorView } from "@codemirror/view";
import { useCodeStorage } from "../../hooks/useCodeStorage.ts";
import { amazeingAutocomplete } from "../../codemirror/autocomplete/autocomplete.ts";
import { FaRegFolderOpen } from "react-icons/fa6";
import { ActiveFile } from "./FileList/ActiveFile/ActiveFile.tsx";
import { FileList } from "./FileList/FileList.tsx";

const AUTO_SAVE_INTERVAL = 5000; // ms

// TODO: Add error line state to CodeMirror
export type TabbedCodeEditorProps =
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

export type CodeEditorProps = {
  code: string;
  setCode: (code: string) => void;
  currentLine: number | null;
  runSpeed?: number;
  isRunning?: boolean;
} & TabbedCodeEditorProps;

export function CodeEditor({
  code,
  setCode,
  currentLine,
  tabbed,
  fileName,
  setFileName,
}: CodeEditorProps) {
  const [filesOpen, setFilesOpen] = useState(false);
  const { editorTheme, setEditorTheme, fontSize, setFontSize } =
    useEditorSettings();
  const { saveFile, loadFile } = useCodeStorage();
  const { t } = useTranslation();

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
        editorTheme.isLight ? "light-theme" : "dark-theme",
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
        <Popup
          trigger={
            <Button shape="icon" className={styles.settingsButton}>
              <VscSettings size={20} />
            </Button>
          }
          position="left center"
        >
          <FormGroup>
            <FormField label={t("codeEditor.theme")}>
              <ThemeSelect
                editorTheme={editorTheme}
                setEditorTheme={setEditorTheme}
              />
            </FormField>
            <FormField label={t("codeEditor.fontSize")}>
              <input
                type="number"
                min={8}
                max={32}
                defaultValue={fontSize}
                onChange={(e) => {
                  const size = Number(e.target.value);
                  setFontSize(size);
                }}
              />
            </FormField>
          </FormGroup>
        </Popup>
      </CornerGroup>

      <ReactCodeMirror
        key={fileName ?? "single-editor"}
        value={code}
        className={styles.codeEditor}
        height="100%"
        theme={editorTheme.extension}
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
          fontSize,
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
