import { CodeEditorWithPanel } from "../CodeEditorWithPanel/CodeEditorWithPanel.tsx";
import type { Extension } from "@codemirror/state";
import { useTranslation } from "react-i18next";
import { GrTask } from "react-icons/gr";

type TaskCodeEditorProps = {
  setCode: (code: string) => void;
  editorExtensions?: Extension[];
  transitionDuration: number;
};

export function TaskCodeEditor({
  setCode,
  editorExtensions,
  transitionDuration,
}: TaskCodeEditorProps) {
  const { t } = useTranslation();
  return (
    <CodeEditorWithPanel
      title="Day 1"
      code={""}
      setCode={setCode}
      transitionDuration={transitionDuration}
      editorExtensions={editorExtensions}
      initialOpen
      panel={{
        name: t("codeEditor.tasks"),
        content: (
          <>
            <h1>Tasks</h1>
            <p>This panel is for managing tasks related to the code.</p>
          </>
        ),
        icon: () => <GrTask />,
      }}
    />
  );
}
