import { Window } from "../ui/Window/Window.tsx";
import { useTranslation } from "react-i18next";
import styles from "./CodeEditor.module.css";
import Editor from "react-simple-code-editor";

export function CodeEditor({
  code,
  setCode,
}: {
  code: string;
  setCode: (code: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <Window title={t("codeEditor.title")}>
      <Editor
        textareaClassName={styles.codeEditor}
        highlight={(code) => code}
        onValueChange={setCode} value={code}
        padding="1rem"
        style={{
          fontFamily: '"Jetbrains Mono", monospace',
          backgroundColor: 'var(--clr-surface-a0)',
          height: "100%",
        }}
      />
    </Window>
  );
}
