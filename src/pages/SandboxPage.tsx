import { Layout } from "../components/Layout/Layout.tsx";
import { CodeStorageProvider } from "../editor/storage/CodeStorageProvider.tsx";
import { Editor } from "../editor/components/Editor/Editor.tsx";
import { Level } from "../game/level.ts";
import { LevelStorageProvider } from "../game/storage/LevelStorageProvider.tsx";
import { EditorRuntimeProvider } from "../editor/runtime/EditorRuntimeProvider.tsx";
import { EditorSettingsProvider } from "../editor/settings/EditorSettingsProvider.tsx";

export const sandboxLevel = new Level({
  id: "sandbox",
  name: "Sandbox Level",
  description: "A tiny 3x3 test maze.",
  maze: {
    tiles: [
      ["grass", "grass", "grass"],
      ["grass", "grass", "grass"],
      ["grass", "grass", "grass"],
    ],
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

export function SandboxPage() {
  return (
    <Layout fullWidth>
      <CodeStorageProvider fileNamespace="sandbox">
        <LevelStorageProvider fileNamespace="custom">
          <EditorSettingsProvider namespace="sandbox-editor">
            <EditorRuntimeProvider startingLevel={sandboxLevel}>
              <Editor allowChangingLevel file />
            </EditorRuntimeProvider>
          </EditorSettingsProvider>
        </LevelStorageProvider>
      </CodeStorageProvider>
    </Layout>
  );
}
