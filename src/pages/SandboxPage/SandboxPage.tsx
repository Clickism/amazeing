import { Layout } from "../../shared/components/Layout/Layout.tsx";
import { Editor } from "../../features/editor/components/Editor/Editor.tsx";
import { Level, type LevelData } from "../../core/game/level.ts";
import { loadTask } from "../../features/precourse/day.ts";
import { useFileStorage } from "../../features/editor/context/storage/useFileStorage.ts";
import { EditorSettingsProvider } from "../../features/editor/context/settings/EditorSettingsProvider.tsx";
import { FileCodeModelProvider } from "../../features/editor/context/code/FileCodeModelProvider.tsx";
import { LevelProvider } from "../../features/editor/context/level/LevelProvider.tsx";
import { InterpreterProvider } from "../../features/editor/context/interpreter/InterpreterProvider.tsx";

export function SandboxPage() {
  const levelStorage = useFileStorage<LevelData>("custom");
  const level = new Level(loadTask("sandbox/task").levelData);
  return (
    <Layout fullWidth>
      <EditorSettingsProvider namespace="sandbox">
        <FileCodeModelProvider namespace="sandbox">
          <LevelProvider level={level}>
            <InterpreterProvider.Wrapper level={level}>
              <Editor levelStorage={levelStorage} owlControls />
            </InterpreterProvider.Wrapper>
          </LevelProvider>
        </FileCodeModelProvider>
      </EditorSettingsProvider>
    </Layout>
  );
}
