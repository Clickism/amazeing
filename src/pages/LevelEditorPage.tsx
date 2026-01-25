import { Layout } from "../components/Layout/Layout.tsx";
import { LevelEditor } from "../level-editor/components/LevelEditor/LevelEditor.tsx";
import { LevelStorageProvider } from "../level-editor/storage/LevelStorageProvider.tsx";

export function LevelEditorPage() {
  return (
    <Layout fullWidth>
      <LevelStorageProvider fileNamespace="custom">
        <LevelEditor />
      </LevelStorageProvider>
    </Layout>
  );
}
