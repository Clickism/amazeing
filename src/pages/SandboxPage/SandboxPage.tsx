import { Layout } from "../../shared/components/Layout/Layout.tsx";
import { Editor } from "../../features/editor/components/Editor/Editor.tsx";
import { Level, type LevelData } from "../../core/game/level.ts";
import { loadTask } from "../../features/precourse/day.ts";
import { useFileStorage } from "../../features/editor/context/storage/useFileStorage.ts";
import { EditorSettingsProvider } from "../../features/editor/context/settings/EditorSettingsProvider.tsx";
import { FileCodeModelProvider } from "../../features/editor/context/code/FileCodeModelProvider.tsx";
import { LevelProvider } from "../../features/editor/context/level/LevelProvider.tsx";
import { useLevel } from "../../features/editor/context/level/LevelContext.tsx";
import { InterpreterWrapper } from "../../features/editor/context/interpreter/InterpreterWrapper.tsx";

export function SandboxPage() {
  const level = new Level(loadTask("sandbox/task").levelData);
  return (
    <Layout fullWidth>
      <EditorSettingsProvider namespace="sandbox">
        <FileCodeModelProvider namespace="sandbox">
          <LevelProvider level={level}>
            <LevelWrapper />
          </LevelProvider>
        </FileCodeModelProvider>
      </EditorSettingsProvider>
    </Layout>
  );
}

function LevelWrapper() {
  const { level } = useLevel();
  const levelStorage = useFileStorage<LevelData>("custom");
  return (
    <InterpreterWrapper level={level}>
      <Editor levelStorage={levelStorage} owlControls />
    </InterpreterWrapper>
  );
}
