import { Layout } from "../components/Layout/Layout.tsx";
import { CodeStorageProvider } from "../editor/storage/CodeStorageProvider.tsx";
import { EditorSettingsProvider } from "../editor/settings/EditorSettingsProvider.tsx";
import { Editor } from "../editor/components/Editor/Editor.tsx";
import { Level } from "../game/level.ts";
import { TasksProvider } from "../precourse/context/TasksProvider.tsx";
import { useTasks } from "../precourse/context/TasksContext.tsx";
import { taskIdOf } from "../precourse/day.ts";
import { EditorEnvironment } from "../editor/environment/EditorEnvironment.tsx";

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
