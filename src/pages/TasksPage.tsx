import { Layout } from "../components/Layout/Layout.tsx";
import { CodeStorageProvider } from "../editor/storage/CodeStorageProvider.tsx";
import { EditorSettingsProvider } from "../editor/settings/EditorSettingsProvider.tsx";
import { EditorRuntimeProvider } from "../editor/runtime/EditorRuntimeProvider.tsx";
import { Editor } from "../editor/components/Editor/Editor.tsx";
import { Level } from "../game/level.ts";
import { TasksProvider } from "../precourse/context/TasksProvider.tsx";
import { useTasks } from "../precourse/context/TasksContext.tsx";
import { taskIdOf } from "../precourse/day.ts";

const sandboxLevel = new Level({
  name: "sandbox",
  title: "Sandbox Level",
  description: "A tiny 3x3 test maze.",
  maze: {
    tileType: "grass",
    width: 3,
    height: 3,
    walls: {
      horizontal: [
        [null, null, null],
        ["stone", null, "stone"],
        [null, null, null],
        [null, null, null],
      ],
      vertical: [
        [null, null, null, null],
        [null, "stone", "stone", null],
        [null, null, null, null],
      ],
    },
  },
  owlStart: {
    position: { x: 0, y: 0 },
    direction: "south",
  },
  finishPosition: { x: 2, y: 2 },
});

export function TasksPage() {
  return (
    <Layout fullWidth>
      <CodeStorageProvider fileNamespace="tasks">
        <EditorSettingsProvider namespace="sandbox-editor">
          <TasksProvider taskId={taskIdOf(1, 1)}>
            <EditorWrapper startingLevel={sandboxLevel} />
          </TasksProvider>
        </EditorSettingsProvider>
      </CodeStorageProvider>
    </Layout>
  );
}

// Wrapper to access tasks context
function EditorWrapper({ startingLevel }: { startingLevel: Level }) {
  const { task } = useTasks();
  return (
    <EditorRuntimeProvider task={task} startingLevel={startingLevel}>
      <Editor type="task" />
    </EditorRuntimeProvider>
  );
}
