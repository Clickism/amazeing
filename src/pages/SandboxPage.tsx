import { Layout } from "../components/Layout/Layout.tsx";
import { CodeStorageProvider } from "../context/CodeStorageProvider.tsx";
import { Editor } from "../components/Editor/Editor.tsx";
import { Level } from "../game/level.ts";

const sandboxLevel = new Level({
  name: "Sandbox",
  description: "Sandbox Level",
  maze: {
    tiles: [
      [
        {
          type: "grass",
          walls: { north: "stone", south: null, east: null, west: "stone" },
        },
        {
          type: "grass",
          walls: { north: "stone", south: null, east: null, west: null },
        },
        {
          type: "grass",
          walls: { north: "stone", south: null, east: "stone", west: null },
        },
      ],

      [
        {
          type: "grass",
          walls: { north: null, south: null, east: "stone", west: "stone" },
        },
        {
          type: "grass",
          walls: { north: null, south: null, east: null, west: "stone" },
        },
        {
          type: "grass",
          walls: { north: null, south: null, east: "stone", west: null },
        },
      ],

      [
        {
          type: "grass",
          walls: { north: null, south: "stone", east: null, west: "stone" },
        },
        {
          type: "grass",
          walls: { north: null, south: "stone", east: null, west: null },
        },
        {
          type: "grass",
          walls: { north: null, south: "stone", east: "stone", west: null },
        },
      ],
    ],
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
