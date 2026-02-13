import { CodeEditorWithPanel } from "../CodeEditorWithPanel/CodeEditorWithPanel.tsx";
import type { Extension } from "@codemirror/state";
import { GrTask } from "react-icons/gr";
import { TaskView } from "./TaskView/TaskView.tsx";
import { useTasks } from "../../../precourse/context/TasksContext.tsx";
import { useTranslatable } from "../../../i18n/i18n.ts";

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
  const { t } = useTranslatable();
  const { task } = useTasks();
  return (
    <CodeEditorWithPanel
      title={t(task.title)}
      code={""}
      setCode={setCode}
      transitionDuration={transitionDuration}
      editorExtensions={editorExtensions}
      initialOpen
      panel={{
        name: t("codeEditor.tasks"),
        content: <TaskView />,
        icon: () => <GrTask />,
      }}
    />
  );
}
