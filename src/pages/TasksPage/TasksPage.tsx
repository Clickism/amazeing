import { Layout } from "../../shared/components/Layout/Layout.tsx";
import { EditorSettingsProvider } from "../../features/editor/context/settings/EditorSettingsProvider.tsx";
import { Editor } from "../../features/editor/components/Editor/Editor.tsx";
import { Level } from "../../core/game/level.ts";
import { TasksProvider } from "../../features/precourse/context/TasksProvider.tsx";
import { useTasks } from "../../features/precourse/context/TasksContext.tsx";
import { taskIdOf } from "../../features/precourse/day.ts";
import { TaskCodeModelProvider } from "../../features/editor/context/code/TaskCodeModelProvider.tsx";
import { InterpreterProvider } from "../../features/editor/context/interpreter/InterpreterProvider.tsx";

export function TasksPage() {
  return (
    <Layout fullWidth>
      <EditorSettingsProvider namespace="tasks">
        <TasksProvider taskId={taskIdOf(1, 1)}>
          <TaskCodeModelProvider namespace="tasks">
            <EditorWrapper />
          </TaskCodeModelProvider>
        </TasksProvider>
      </EditorSettingsProvider>
    </Layout>
  );
}

// Wrapper to access tasks context
function EditorWrapper() {
  const { task } = useTasks();
  return (
    <InterpreterProvider.Wrapper level={new Level(task.levelData)}>
      <Editor />
    </InterpreterProvider.Wrapper>
  );
}
