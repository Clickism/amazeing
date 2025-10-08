import Editor from "react-simple-code-editor";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import styles from "./CodeEditor.module.css";
import { type CSSProperties, useEffect, useRef } from "react";
import clsx from "clsx";
import { useEditorTheme } from "../../hooks/useEditorTheme.ts";
import { CornerGroup } from "../ui/CornerGroup/CornerGroup.tsx";
import { Button } from "../ui/Button/Button.tsx";
import { RxGear } from "react-icons/rx";
import Popup from "reactjs-popup";
import { ThemeSelect } from "./ThemeSelect/ThemeSelect.tsx";
import { LineNumbers } from "./LineNumbers/LineNumbers.tsx";

const AUTO_SAVE_INTERVAL = 5000; // ms

type Props = {
  code: string;
  setCode: (code: string) => void;
  currentLine: number | null;
  filename?: string;
};

function overrideTheme(theme: PrismTheme) {
  return {
    ...theme,
    plain: {
      ...theme.plain,
      fontFamily: "Jetbrains Mono, monospace",
    },
  };
}

export function CodeEditor({
  code,
  setCode,
  currentLine,
  filename,
}: Props) {
  const localStoragePath = filename ? `editor:file:${filename}` : undefined;
  const savedCodeRef = useRef<string | null>(
    localStoragePath ? localStorage.getItem(localStoragePath) : null,
  );
  const codeRef = useRef(code);

  const { editorTheme, setEditorTheme } = useEditorTheme();
  const theme = overrideTheme(editorTheme);
  const lineNumbers = code.split("\n").length;

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
    <div
      className={clsx(styles.container, "window-border")}
      style={
        {
          "--foreground-color": theme.plain.color,
          "--background-color": theme.plain.backgroundColor,
        } as CSSProperties
      }
    >
      <CornerGroup>
        <Popup
          trigger={
            <Button variant="icon-only">
              <RxGear />
            </Button>
          }
          position="left center"
        >
          Theme: &nbsp;
          <ThemeSelect
            editorTheme={editorTheme}
            setEditorTheme={setEditorTheme}
          />
        </Popup>
      </CornerGroup>
      <LineNumbers lineNumbers={lineNumbers} currentLine={currentLine} />
      <Editor
        className={styles.codeEditor}
        value={code}
        onValueChange={setCode}
        highlight={(code) => (
          <Highlight theme={theme} code={code} language="amazeing">
            {({ style, tokens, getLineProps, getTokenProps }) => (
              <pre style={{ ...style, margin: 0 }}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        )}
        padding={10}
        style={{
          flex: 1,
        }}
      />
    </div>
  );
}
