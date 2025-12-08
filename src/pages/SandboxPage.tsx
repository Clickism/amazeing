import { Layout } from "../components/Layout/Layout.tsx";
import { CodeStorageProvider } from "../context/CodeStorageProvider.tsx";
import { Editor } from "../components/Editor/Editor.tsx";
import { Level } from "../game/level.ts";

const sandboxLevel = new Level({
  name: "Test Level",
  description: "A tiny 3x3 test maze.",
  maze: {
    tiles: [
      [{ type: "grass" }, { type: "grass" }, { type: "grass" }],
      [{ type: "grass" }, { type: "grass" }, { type: "grass" }],
      [{ type: "grass" }, { type: "grass" }, { type: "grass" }],
    ],
    walls: {
      horizontal: [
        [{ type: null }, { type: null }, { type: null }],
        [{ type: "stone" }, { type: null }, { type: null }],
        [{ type: null }, { type: null }, { type: null }],
        [{ type: null }, { type: null }, { type: null }],
      ],
      vertical: [
        [{ type: null }, { type: null }, { type: null }, { type: null }],
        [{ type: null }, { type: "stone" }, { type: null }, { type: null }],
        [{ type: null }, { type: null }, { type: null }, { type: null }],
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
        <Editor level={sandboxLevel} tabbed />
      </CodeStorageProvider>
    </Layout>
  );
}
