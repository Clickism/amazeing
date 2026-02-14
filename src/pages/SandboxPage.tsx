import { Layout } from "../components/Layout/Layout.tsx";
import { Editor } from "../editor/components/Editor/Editor.tsx";
import { Level } from "../game/level.ts";
import { LevelStorageProvider } from "../level-editor/storage/LevelStorageProvider.tsx";
import { loadTask } from "../precourse/day.ts";
import { EditorEnvironment } from "../editor/environment/EditorEnvironment.tsx";

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
