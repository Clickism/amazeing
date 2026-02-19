import {
  createEmptyMazeData,
  Maze,
  type MazeData,
  resizeMaze,
} from "./maze.ts";
import {
  type CardinalDirection,
  inDirection,
  type Position,
} from "../interpreter/types.ts";
import { type OwlData } from "./owl.ts";
import type { PackagedTranslation } from "../../shared/i18n/i18n.ts";

export type LevelData = {
  /**
   * The unique name of the level (within the level storage)
   */
  name?: string;
  maze: MazeData;
  owlStart: {
    position: Position;
    direction: CardinalDirection;
  };
  finishPosition: Position;

  /**
   * Task metadata for the level, used for saving task metadata
   * for the custom level storage.
   */
  taskMeta?: {
    title?: PackagedTranslation;
    description?: PackagedTranslation;
    startingCode?: string;
  };
};

/**
 * Represents a level in the game.
 */
export class Level {
  data: LevelData;
  maze: Maze;

  constructor(data: LevelData) {
    this.data = data;
    this.maze = new Maze(data.maze);
  }

  createOwlData(): OwlData {
    return {
      position: { ...this.data.owlStart.position },
      direction: this.data.owlStart.direction,
    };
  }

  canOwlMove(owl: OwlData, direction?: CardinalDirection): boolean {
    const directionToCheck = direction ?? owl.direction;
    const wall = this.maze.wallAt(owl.position, directionToCheck);
    const hasTile = this.maze.hasTileAt(
      inDirection(owl.position, directionToCheck),
    );
    return !wall && hasTile;
  }

  isOwlAtFinish(owl: OwlData): boolean {
    return (
      owl.position.x === this.data.finishPosition.x &&
      owl.position.y === this.data.finishPosition.y
    );
  }
}

/**
 * Resizes a level to new dimensions, adjusting the maze and positions accordingly.
 * @param level The level to resize
 * @param newWidth The new width of the level
 * @param newHeight The new height of the level
 */
export function resizeLevel(
  level: LevelData,
  newWidth: number,
  newHeight: number,
): LevelData {
  const newMazeData = resizeMaze(level.maze, newWidth, newHeight);
  const newOwlStart = {
    position: {
      x: Math.min(level.owlStart.position.x, newWidth - 1),
      y: Math.min(level.owlStart.position.y, newHeight - 1),
    },
    direction: level.owlStart.direction,
  };
  const newFinishPosition = {
    x: Math.min(level.finishPosition.x, newWidth - 1),
    y: Math.min(level.finishPosition.y, newHeight - 1),
  };
  return {
    ...level,
    maze: newMazeData,
    owlStart: newOwlStart,
    finishPosition: newFinishPosition,
  };
}

/**
 * Creates an empty level with the specified dimensions and optional name.
 * @param name Optional name for the level
 * @param width Width of the level (number of tiles horizontally)
 * @param height Height of the level (number of tiles vertically)
 */
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
