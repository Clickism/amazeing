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
import ReactCodeMirror, { tooltips } from "@uiw/react-codemirror";
import {
  amazeing,
  amazeingAutocomplete,
} from "../../codemirror/amazeingExtension.ts";
import { currentLineHighlighter } from "../../codemirror/currentLineHighlighter.ts";

const AUTO_SAVE_INTERVAL = 5000; // ms

type Props = {
  code: string;
  setCode: (code: string) => void;
  currentLine: number | null;
  filename?: string;
  runSpeed?: number;
  isRunning?: boolean;
};

const FONT_STORAGE_KEY = "editor:fontSize";

export function CodeEditor({ code, setCode, currentLine, filename }: Props) {
  const { t } = useTranslation();
  const localStoragePath = filename ? `editor:file:${filename}` : undefined;
  const savedCodeRef = useRef<string | null>(
    localStoragePath ? localStorage.getItem(localStoragePath) : null,
  );
  const codeRef = useRef(code);
  const [fontSize, setFontSize] = useState(() => {
    const storedSize = localStorage.getItem(FONT_STORAGE_KEY);
    return storedSize ? Number(storedSize) : 14;
  });

  const { editorTheme, setEditorTheme } = useEditorTheme();

  useEffect(() => {
    // Save font size to localStorage
    localStorage.setItem(FONT_STORAGE_KEY, fontSize.toString());
    // Set tooltip font size
    document.getElementById("tooltip-root")!.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

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
