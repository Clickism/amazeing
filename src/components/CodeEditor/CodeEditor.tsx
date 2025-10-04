import { Window } from "../ui/Window/Window.tsx";
import { useTranslation } from "react-i18next";
import Editor from "react-simple-code-editor";
import { Highlight, themes } from "prism-react-renderer";
import styles from "./CodeEditor.module.css";
import type { CSSProperties } from "react";

function LineNumbers({ lineNumbers }: { lineNumbers: number }) {
  return (
    <div className={styles.lineNumbers}>
      {Array.from({ length: lineNumbers }).map((_, i) => (
        <div key={i} className={styles.lineNumber}>
          {i + 1}
        </div>
      ))}
    </div>
  );
}

export function CodeEditor({
  code,
  setCode,
}: {
  code: string;
  setCode: (code: string) => void;
}) {
  const { t } = useTranslation();
  const theme = {
    ...themes.vsDark,
    plain: {
      ...themes.vsDark.plain,
      fontFamily: "Jetbrains Mono, monospace",
    }
  }
  const lineNumbers = code.split("\n").length;
  return (
    <Window title={t("codeEditor.title")}>
      <div className={styles.codeEditor} style={{
        "--foreground-color": theme.plain.color,
        "--background-color": theme.plain.backgroundColor
      } as CSSProperties}>
        <LineNumbers lineNumbers={lineNumbers} />
        <Editor
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
    </Window>
  );
}
