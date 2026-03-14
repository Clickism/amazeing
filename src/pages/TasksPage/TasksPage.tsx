import { Layout } from "../../shared/components/Layout/Layout.tsx";
import { EditorSettingsProvider } from "../../features/editor/context/settings/EditorSettingsProvider.tsx";
import { Editor } from "../../features/editor/components/Editor/Editor.tsx";
import { Level } from "../../core/game/level.ts";
import { TasksProvider } from "../../features/precourse/context/TasksProvider.tsx";
import { useTasks } from "../../features/precourse/context/TasksContext.tsx";
import { taskIdOf } from "../../features/precourse/day.ts";
import { TaskCodeModelProvider } from "../../features/editor/context/code/TaskCodeModelProvider.tsx";
import { useEffect, useMemo } from "react";
import { InterpreterWrapper } from "../../features/editor/context/interpreter/InterpreterWrapper.tsx";
import { useSearchParams } from "react-router-dom";
import { ModalProvider } from "../../shared/floating/context/ModalProvider.tsx";
import { useModalContext } from "../../shared/floating/context/ModalContext.tsx";
import { UnmetConstraints } from "../../features/precourse/components/UnmetConstraints/UnmetConstraints.tsx";

const namespace = "tasks";

const idKey = "id";

export function TasksPage() {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get(idKey) ?? taskIdOf(1, 1);
  return (
    <Layout fullWidth>
      <ModalProvider>
        <EditorSettingsProvider namespace={namespace}>
          <TasksProvider taskId={taskId} namespace={namespace}>
            <EditorWrapper />
          </TasksProvider>
        </EditorSettingsProvider>
      </ModalProvider>
    </Layout>
  );
}

// Wrapper to access tasks context
function EditorWrapper() {
  const { task, completedTasks, setCompleted } = useTasks();
  const level = useMemo(() => new Level(task.levelData), [task.levelData]);
  const [, setSearchParams] = useSearchParams();
  const modal = useModalContext();

  // Update URL when task changes
  useEffect(() => {
    setSearchParams({ [idKey]: task.id });
  }, [setSearchParams, task.id]);

  return (
    <TaskCodeModelProvider task={task} namespace={namespace}>
      <InterpreterWrapper
        level={level}
        constraints={task.constraints}
        onFinish={(constraints) => {
          if (constraints.every((c) => c.met)) {
            setCompleted(task.id, true);
          } else if (!completedTasks.includes(task.id)) {
            // TODO: Add warning popup
            modal.setContent(
              <UnmetConstraints modal={modal} constraints={constraints} />,
            );
            modal.setOpen(true);
          }
        }}
      >
        <Editor />
      </InterpreterWrapper>
    </TaskCodeModelProvider>
  );
}
