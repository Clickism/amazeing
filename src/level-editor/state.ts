import type { LevelData } from "../game/level.ts";
import { createEmptyMazeData } from "../game/maze.ts";
import {
  TILE_TOOLS,
  type TileTool,
  WALL_TOOLS,
  type WallTool,
} from "./tools.tsx";
import type { ActionDispatch } from "react";
import type { LevelEditorAction } from "./actions.ts";

export type LevelEditorDispatch = ActionDispatch<[action: LevelEditorAction]>;

export type LevelEditorState = {
  tileTool: TileTool;
  wallTool: WallTool;
  visualize: boolean;

  level: LevelData;
};

export function emptyLevelData(
  name?: string,
  width: number = 5,
  height: number = 5,
): LevelData {
  return {
    name,
    maze: createEmptyMazeData(width, height),
    finishPosition: {
      x: width - 1,
      y: height - 1,
    },
    owlStart: {
      direction: "south",
      position: {
        x: 0,
        y: 0,
      },
    },
  };
}

export function fromLevelData(level: LevelData): LevelEditorState {
  return {
    tileTool: TILE_TOOLS[0],
    wallTool: WALL_TOOLS[0],
    visualize: false,
    level,
  };
}

export function emptyEditorState(
  name?: string,
  width: number = 5,
  height: number = 5,
): LevelEditorState {
  return {
    tileTool: TILE_TOOLS[0],
    wallTool: WALL_TOOLS[0],
    visualize: false,
    level: emptyLevelData(name, width, height),
  };
}

export function stringifyLevelData(editor: LevelEditorState): string {
  return JSON.stringify(editor.level, null, 2);
}
