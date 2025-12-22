import type { LevelData } from "../game/level.ts";
import { createEmptyMazeData } from "../game/maze.ts";
import {
  TILE_TOOLS,
  type TileTool,
  WALL_TOOLS,
  type WallTool,
} from "./tools.tsx";
import type { ActionDispatch } from "react";
import type { EditorAction } from "./actions.ts";

export type EditorDispatch = ActionDispatch<[action: EditorAction]>;

export type EditorState = {
  width: number;
  height: number;
  tileTool: TileTool;
  wallTool: WallTool;
  visualize: boolean;
} & LevelData;

export function createInitialEditorState(): EditorState {
  return createEditorState(5, 5);
}

export function createEditorState(width: number, height: number): EditorState {
  return {
    width,
    height,
    tileTool: TILE_TOOLS[0],
    wallTool: WALL_TOOLS[0],
    visualize: false,
    maze: createEmptyMazeData(width, height),
    description: "Level Description",
    finishPosition: {
      x: width - 1,
      y: height - 1,
    },
    name: "Level Name",
    owlStart: {
      direction: "south",
      position: {
        x: 0,
        y: 0,
      },
    },
  };
}

export function stringifyEditorState(editor: EditorState): string {
  return JSON.stringify(
    {
      name: editor.name,
      description: editor.description,
      maze: editor.maze,
      owlStart: editor.owlStart,
      finishPosition: editor.finishPosition,
    },
    null,
    2,
  );
}
