import { Layout } from "../components/Layout/Layout.tsx";
import { LevelEditor } from "../level-editor/components/LevelEditor/LevelEditor.tsx";

export function LevelEditorPage() {
  return (
    <Layout fullWidth>
      <LevelEditor />
    </Layout>
  )
}
