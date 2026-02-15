import { Layout } from "../../shared/components/Layout/Layout.tsx";
import { LevelEditor } from "../../features/level-editor/components/LevelEditor/LevelEditor.tsx";
import { LevelStorageProvider } from "../../features/level-editor/storage/LevelStorageProvider.tsx";
import { useState } from "react";
import { LevelSourceProvider } from "../../features/editor/source/LevelSourceProvider.tsx";
import type { LevelData } from "../../core/game/level.ts";
import { emptyLevelData } from "../../features/level-editor/state.ts";

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
