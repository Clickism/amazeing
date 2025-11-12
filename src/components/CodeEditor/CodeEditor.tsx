import styles from "./CodeEditor.module.css";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useEditorTheme } from "../../hooks/useEditorTheme.ts";
import { CornerGroup } from "../ui/CornerGroup/CornerGroup.tsx";
import { Button } from "../ui/Button/Button.tsx";
import Popup from "reactjs-popup";
import { ThemeSelect } from "./ThemeSelect/ThemeSelect.tsx";
import { VscSettings } from "react-icons/vsc";
import { FormField } from "../ui/Form/FormField/FormField.tsx";
import { useTranslation } from "react-i18next";
import { FormGroup } from "../ui/Form/FormGroup/FormGroup.tsx";
import ReactCodeMirror from "@uiw/react-codemirror";
import {
  amazeing,
  amazeingAutocomplete,
} from "../../codemirror/amazeingExtension.ts";
import { currentLineHighlighter } from "../../codemirror/currentLineHighlighter.ts";
import { tooltips } from "@codemirror/view";

const AUTO_SAVE_INTERVAL = 5000; // ms

type Props = {
  code: string;
  setCode: (code: string) => void;
  currentLine: number | null;
  filename?: string;
  runSpeed?: number;
  isRunning?: boolean;
};

export function CodeEditor({ code, setCode, currentLine, filename }: Props) {
  const { t } = useTranslation();
  const localStoragePath = filename ? `editor:file:${filename}` : undefined;
  const savedCodeRef = useRef<string | null>(
    localStoragePath ? localStorage.getItem(localStoragePath) : null,
  );
  const codeRef = useRef(code);
  const [fontSize, setFontSize] = useState(14);

  const { editorTheme, setEditorTheme } = useEditorTheme();

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // Load code from localStorage
  useEffect(() => {
    if (!localStoragePath) return;
    const storedCode = localStorage.getItem(localStoragePath);
    if (storedCode !== null) {
      setCode(storedCode);
    }
  }, [localStoragePath, setCode]);

  // Auto-save
  useEffect(() => {
    if (!localStoragePath) return;
    const interval = setInterval(() => {
      if (codeRef.current === savedCodeRef.current) return;
      savedCodeRef.current = codeRef.current;
      localStorage.setItem(localStoragePath, codeRef.current);
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [localStoragePath]);

  // Save on close
  useEffect(() => {
    if (!localStoragePath) return;
    const handleBeforeUnload = () => {
      if (codeRef.current === savedCodeRef.current) return;
      localStorage.setItem(localStoragePath, codeRef.current);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [localStoragePath]);

  return (
    <div className={clsx(styles.container, "window-border")}>
      <CornerGroup>
        <Popup
          trigger={
            <Button variant="icon-only">
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
                defaultValue={14}
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
        value={code}
        className={styles.codeEditor}
        height="100%"
        theme={editorTheme.extension}
        extensions={[
          amazeing,
          amazeingAutocomplete,
          currentLineHighlighter(() => currentLine),
          tooltips({
            parent: document.body,
          }),
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
    </div>
  );
}
