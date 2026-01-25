import type { LevelData } from "../game/level.ts";
import { createEmptyMazeData } from "../game/maze.ts";
import { TILE_TOOLS, type TileTool, WALL_TOOLS, type WallTool } from "./tools.tsx";
import type { ActionDispatch } from "react";
import type { LevelEditorAction } from "./actions.ts";

export type LevelEditorDispatch = ActionDispatch<[action: LevelEditorAction]>;

export type LevelEditorState = {
  width: number;
  height: number;
  tileTool: TileTool;
  wallTool: WallTool;
  visualize: boolean;
} & LevelData;

export function createInitialEditorState(
  name: string,
  description: string,
): LevelEditorState {
  return createEditorState(name, description, 5, 5);
}

export function createEditorStateFromLevelData(
  level: LevelData,
): LevelEditorState {
  return {
    width: level.maze.width,
    height: level.maze.height,
    tileTool: TILE_TOOLS[0],
    wallTool: WALL_TOOLS[0],
    visualize: false,
    ...level,
  };
}

export function createEditorState(
  name: string,
  description: string,
  width: number,
  height: number,
): LevelEditorState {
  return {
    width,
    height,
    tileTool: TILE_TOOLS[0],
    wallTool: WALL_TOOLS[0],
    visualize: false,
    maze: createEmptyMazeData(width, height),
    finishPosition: {
      x: width - 1,
      y: height - 1,
    },
    name,
    title: name,
    description,
    owlStart: {
      direction: "south",
      position: {
        x: 0,
        y: 0,
      },
    },
  };
}

export function toLevelData(editor: LevelEditorState): LevelData {
  return {
    name: editor.name,
    title: editor.name,
    description: editor.description,
    maze: editor.maze,
    owlStart: editor.owlStart,
    finishPosition: editor.finishPosition,
  };
}

export function stringifyLevelData(editor: LevelEditorState): string {
  return JSON.stringify(toLevelData(editor), null, 2);
}
