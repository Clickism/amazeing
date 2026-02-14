import { Layout } from "../components/Layout/Layout.tsx";
import { LevelEditor } from "../level-editor/components/LevelEditor/LevelEditor.tsx";
import { LevelStorageProvider } from "../level-editor/storage/LevelStorageProvider.tsx";
import { useState } from "react";
import { LevelSourceProvider } from "../editor/source/LevelSourceProvider.tsx";
import type { LevelData } from "../game/level.ts";
import { emptyLevelData } from "../level-editor/state.ts";

export function LevelEditorPage() {
  const [level, setLevel] = useState<LevelData>(emptyLevelData());
  return (
    <Layout fullWidth>
      <LevelStorageProvider fileNamespace="custom">
        <LevelSourceProvider level={level} setLevel={setLevel}>
          <LevelEditor />
        </LevelSourceProvider>
      </LevelStorageProvider>
    </Layout>
  );
}
