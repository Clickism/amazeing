import { Layout } from "../shared/components/Layout/Layout.tsx";
import { Editor } from "../features/editor/components/Editor/Editor.tsx";
import { Level } from "../core/game/level.ts";
import { LevelStorageProvider } from "../features/level-editor/storage/LevelStorageProvider.tsx";
import { loadTask } from "../features/precourse/day.ts";
import { EditorEnvironment } from "../features/editor/environment/EditorEnvironment.tsx";

export function SandboxPage() {
  const level = new Level(loadTask("sandbox/task").levelData);
  return (
    <Layout fullWidth>
      <LevelStorageProvider fileNamespace="custom">
        <EditorEnvironment level={level} storageNamespace="sandbox">
          <Editor type="file" allowChangingLevel owlControls />
        </EditorEnvironment>
      </LevelStorageProvider>
    </Layout>
  );
}
