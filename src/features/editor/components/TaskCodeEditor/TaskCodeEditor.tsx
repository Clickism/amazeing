import {
  CodeEditorWithPanel,
  type CodeEditorWithPanelProps,
  type PanelMinWidths,
} from "../CodeEditorWithPanel/CodeEditorWithPanel.tsx";
import { GrTask } from "react-icons/gr";
import { TaskView } from "./TaskView/TaskView.tsx";
import { useTasks } from "../../../precourse/context/TasksContext.tsx";
import { useTranslatable } from "../../../../shared/i18n/i18n.ts";
import { useCodeModel } from "../../context/code/CodeModelContext.tsx";
import { CodeReset } from "./CodeReset/CodeReset.tsx";

type TaskCodeEditorProps = Partial<CodeEditorWithPanelProps> & {
  transitionDuration: number;
  minWidths: PanelMinWidths;
};

export function TaskCodeEditor({
  onPanelChange,
  minWidths,
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
        minPixels: [minWidths.codePanel, minWidths.sidePanel],
        initialSizes: [0.6, 0.4],
      }}
      onPanelChange={onPanelChange}
      {...props}
    />
  );
}
