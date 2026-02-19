import { CodeEditor, type CodeEditorProps } from "../CodeEditor.tsx";
import styles from "./MiniCodeEditor.module.css";

type MiniCodeEditorProps = {
  code: string;
  setCode: (code: string) => void;
  height?: number | string;
  editorProps?: Partial<CodeEditorProps>;
};

export function MiniCodeEditor({
  code,
  setCode,
  editorProps,
  height = "200px",
}: MiniCodeEditorProps) {
  return (
    <div className={styles.container} style={{ height }}>
      <CodeEditor
        code={code}
        setCode={setCode}
        showTopBar={false}
        {...editorProps}
      />
    </div>
  );
}
