import Editor from "react-simple-code-editor";
import { Highlight } from "prism-react-renderer";
import styles from "./CodeEditor.module.css";
import type { CSSProperties } from "react";
import clsx from "clsx";
import { useEditorTheme } from "../../hooks/useEditorTheme.ts";
import { CornerGroup } from "../ui/CornerGroup/CornerGroup.tsx";
import { Button } from "../ui/Button/Button.tsx";
import { RxGear } from "react-icons/rx";
import Popup from "reactjs-popup";
import { ThemeSelect } from "./ThemeSelect/ThemeSelect.tsx";
import { FaArrowRight } from "react-icons/fa";

function LineNumbers({
  lineNumbers,
  currentLine,
}: {
  lineNumbers: number;
  currentLine: number | null;
}) {
  return (
    <div className={styles.lineNumbers}>
      {Array.from({ length: lineNumbers }).map((_, i) => (
        <div key={i}>
          <span className={styles.currentLineIndicator}>
            {currentLine === i + 1 && <FaArrowRight size={10} />}
          </span>
          <span className={styles.lineNumber}>{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

export function CodeEditor({
  code,
  setCode,
  currentLine,
}: {
  code: string;
  setCode: (code: string) => void;
  currentLine: number | null;
}) {
  const { editorTheme, setEditorTheme } = useEditorTheme();
  const theme = {
    ...editorTheme,
    plain: {
      ...editorTheme.plain,
      fontFamily: "Jetbrains Mono, monospace",
    },
  };
  const lineNumbers = code.split("\n").length;
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
                  <div key={i} {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
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
