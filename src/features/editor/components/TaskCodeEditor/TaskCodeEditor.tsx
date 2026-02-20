import { CodeEditorWithPanel } from "../CodeEditorWithPanel/CodeEditorWithPanel.tsx";
import type { Extension } from "@codemirror/state";
import { GrTask } from "react-icons/gr";
import { TaskView } from "./TaskView/TaskView.tsx";
import { useTasks } from "../../../precourse/context/TasksContext.tsx";
import { useTranslatable } from "../../../../shared/i18n/i18n.ts";
import { useCodeModel } from "../../context/code/CodeModelContext.tsx";
import { CodeReset } from "./CodeReset/CodeReset.tsx";

type TaskCodeEditorProps = {
  editorExtensions?: Extension[];
  transitionDuration: number;
};

export function TaskCodeEditor({
  editorExtensions,
  transitionDuration,
}: TaskCodeEditorProps) {
  const { t } = useTranslatable();
  const { code, setCode } = useCodeModel();
  const { task } = useTasks();
  return (
    <CodeEditorWithPanel
      title={t(task.title)}
      code={code}
      setCode={setCode}
      transitionDuration={transitionDuration}
      editorExtensions={editorExtensions}
      initialOpen
      topBar={{
        left: [<CodeReset />],
      }}
      panel={{
        name: t("codeEditor.tasks"),
        content: <TaskView />,
        icon: () => <GrTask />,
      }}
    />
  );
}
