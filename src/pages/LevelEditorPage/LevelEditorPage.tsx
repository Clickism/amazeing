import { Layout } from "../../shared/components/Layout/Layout.tsx";
import { LevelEditor } from "../../features/level-editor/components/LevelEditor/LevelEditor.tsx";
import { LevelEditorProvider } from "../../features/level-editor/context/LevelEditorProvider.tsx";

export function LevelEditorPage() {
  return (
    <Layout fullWidth>
      <LevelEditorProvider namespace="custom">
        <LevelEditor />
      </LevelEditorProvider>
    </Layout>
  );
}
