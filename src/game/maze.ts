import { type CardinalDirection, type Position } from "../interpreter/types.ts";

export type MazeData = {
  theme: MazeTheme;
  width: number;
  height: number;
  walls: {
    horizontal: boolean[][];
    vertical: boolean[][];
  };
};

export type MazeTheme = "plains" | "drylands" | "lava";

export const MAZE_THEMES: MazeTheme[] = ["plains", "drylands", "lava"];

export function createEmptyMazeData(
  width: number,
  height: number,
  theme: MazeTheme = "plains",
): MazeData {
  const horizontalWalls: boolean[][] = Array.from({ length: height - 1 }, () =>
    Array.from({ length: width }, () => false),
  );
  const verticalWalls: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width - 1 }, () => false),
  );

  return {
    theme,
    width,
    height,
    walls: {
      horizontal: horizontalWalls,
      vertical: verticalWalls,
    },
  };
}

/**
 * Represents the maze structure.
 */
export class Maze {
  data: MazeData;

  constructor(data: MazeData) {
    this.data = data;
  }

  /**
   * Gets the width of the maze.
   */
  width(): number {
    return this.data.width;
  }

  /**
   * Gets the height of the maze.
   */
  height(): number {
    return this.data.height;
  }

  /**
   * Gets the tile at a given position.
   * @param position
   */
  hasTileAt(position: Position): boolean {
    const { x, y } = position;
    if (y < 0 || y >= this.height()) {
      return false;
    }
    if (x < 0 || x >= this.width()) {
      return false;
    }
    return true;
  }

  /**
   * Get the wall at a given position and direction.
   * @param position
   * @param direction
   */
  wallAt(position: Position, direction: CardinalDirection): boolean {
    const { x, y } = position;
    switch (direction) {
      case "north":
        return this.horizontalWallAt({ x, y: y - 1 });
      case "south":
        return this.horizontalWallAt({ x, y });
      case "east":
        return this.verticalWallAt({ x, y });
      case "west":
        return this.verticalWallAt({ x: x - 1, y });
    }
  }

  forEachHorizontalWall(callback: (position: Position) => void) {
    this.data.walls.horizontal.forEach((row, y) => {
      row.forEach((wall, x) => {
        if (wall) {
          callback({ x, y });
        }
      });
    });
  }

  forEachVerticalWall(callback: (position: Position) => void) {
    this.data.walls.vertical.forEach((row, y) => {
      row.forEach((wall, x) => {
        if (wall) {
          callback({ x, y });
        }
      });
    });
  }

  private horizontalWallAt(position: Position): boolean {
    const { x, y } = position;
    if (y < 0 || y >= this.data.walls.horizontal.length) {
      return false;
    }
    const row = this.data.walls.horizontal[y];
    if (x < 0 || x >= row.length) {
      return false;
    }
    return row[x];
  }

  private verticalWallAt(position: Position): boolean {
    const { x, y } = position;
    if (y < 0 || y >= this.data.walls.vertical.length) {
      return false;
    }
    const row = this.data.walls.vertical[y];
    if (x < 0 || x >= row.length) {
      return false;
    }
    return row[x];
  }
}
