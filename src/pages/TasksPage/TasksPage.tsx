import { Layout } from "../../shared/components/Layout/Layout.tsx";
import { CodeStorageProvider } from "../../features/editor/storage/CodeStorageProvider.tsx";
import { EditorSettingsProvider } from "../../features/editor/settings/EditorSettingsProvider.tsx";
import { Editor } from "../../features/editor/components/Editor/Editor.tsx";
import { Level } from "../../core/game/level.ts";
import { TasksProvider } from "../../features/precourse/context/TasksProvider.tsx";
import { useTasks } from "../../features/precourse/context/TasksContext.tsx";
import { taskIdOf } from "../../features/precourse/day.ts";
import { EditorEnvironment } from "../../features/editor/environment/EditorEnvironment.tsx";

export function TasksPage() {
  return (
    <Layout fullWidth>
      <CodeStorageProvider fileNamespace="tasks">
        <EditorSettingsProvider namespace="sandbox-editor">
          <TasksProvider taskId={taskIdOf(1, 1)}>
            <EditorWrapper />
          </TasksProvider>
        </EditorSettingsProvider>
      </CodeStorageProvider>
    </Layout>
  );
}

// Wrapper to access tasks context
function EditorWrapper() {
  const { task } = useTasks();
  return (
    <EditorEnvironment
      level={new Level(task.levelData)}
      storageNamespace={`task-${task.id}`}
    >
      <Editor type="task" />
    </EditorEnvironment>
  );
}
