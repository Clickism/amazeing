import { Layout } from "../components/Layout/Layout.tsx";
import { CodeStorageProvider } from "../context/CodeStorageProvider.tsx";
import { Editor } from "../components/Editor/Editor.tsx";
import { Level } from "../game/level.ts";
import { LevelStorageProvider } from "../context/LevelStorageProvider.tsx";

const sandboxLevel = new Level({
  id: "sandbox",
  name: "Test Level",
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
          <Editor level={sandboxLevel} levelSelector tabbed />
        </LevelStorageProvider>
      </CodeStorageProvider>
    </Layout>
  );
}
