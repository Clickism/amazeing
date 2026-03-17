import {
  CodeEditorWithPanel,
  type CodeEditorWithPanelProps,
} from "../CodeEditorWithPanel/CodeEditorWithPanel.tsx";
import { GrTask } from "react-icons/gr";
import { TaskView } from "./TaskView/TaskView.tsx";
import { useTasks } from "../../../precourse/context/TasksContext.tsx";
import { useTranslatable } from "../../../../shared/i18n/i18n.ts";
import { useCodeModel } from "../../context/code/CodeModelContext.tsx";
import { CodeReset } from "./CodeReset/CodeReset.tsx";
import { taskEditorMinWidths } from "../../widths.ts";

type TaskCodeEditorProps = Partial<CodeEditorWithPanelProps> & {
  transitionDuration: number;
};

export function TaskCodeEditor({
  onPanelChange,
  ...props
}: TaskCodeEditorProps) {
  const { t } = useTranslatable();
  const { code, setCode } = useCodeModel();
  const { task } = useTasks();
  return (
    <CodeEditorWithPanel
      title={t(task.title)}
      code={code}
      setCode={setCode}
      initialOpen
      topBar={{
        left: [<CodeReset />],
      }}
      panel={{
        name: t("codeEditor.tasks"),
        content: <TaskView />,
        icon: () => <GrTask />,
        minPixels: [
          taskEditorMinWidths.codePanel,
          taskEditorMinWidths.sidePanel,
        ],
        initialSizes: [0.6, 0.4],
      }}
      onPanelChange={onPanelChange}
      {...props}
    />
  );
}
