import type { LevelData } from "../game/level.ts";
import { createEmptyMazeData } from "../game/maze.ts";

export type EditorState = {
  width: number;
  height: number;
} & LevelData;

export function createInitialEditorState(): EditorState {
  return createEditorState(5, 5);
}

export function createEditorState(width: number, height: number): EditorState {
  return {
    width,
    height,
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
