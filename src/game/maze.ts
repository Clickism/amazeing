import { type CardinalDirection, type Position } from "../interpreter/types.ts";

export type MazeData = {
  tileType: TileType;
  width: number;
  height: number;
  walls: {
    horizontal: WallType[][];
    vertical: WallType[][];
  };
};

export type TileType = "grass";
export type WallType = "stone" | null;

export const TILE_TYPES: TileType[] = ["grass"];
export const WALL_TYPES: WallType[] = ["stone"];

export function createEmptyMazeData(
  width: number,
  height: number,
  tileType: TileType = "grass",
): MazeData {
  const horizontalWalls: WallType[][] = Array.from({ length: height - 1 }, () =>
    Array.from({ length: width }, () => null),
  );
  const verticalWalls: WallType[][] = Array.from({ length: height }, () =>
    Array.from({ length: width - 1 }, () => null),
  );

  return {
    tileType,
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
  wallAt(position: Position, direction: CardinalDirection): WallType | null {
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

  forEachHorizontalWall(
    callback: (position: Position, wall: WallType) => void,
  ) {
    this.data.walls.horizontal.forEach((row, y) => {
      row.forEach((wall, x) => {
        if (wall !== null) {
          callback({ x, y }, wall);
        }
      });
    });
  }

  forEachVerticalWall(callback: (position: Position, wall: WallType) => void) {
    this.data.walls.vertical.forEach((row, y) => {
      row.forEach((wall, x) => {
        if (wall !== null) {
          callback({ x, y }, wall);
        }
      });
    });
  }

  private horizontalWallAt(position: Position): WallType {
    const { x, y } = position;
    if (y < 0 || y >= this.data.walls.horizontal.length) {
      return null;
    }
    const row = this.data.walls.horizontal[y];
    if (x < 0 || x >= row.length) {
      return null;
    }
    return row[x];
  }

  private verticalWallAt(position: Position): WallType {
    const { x, y } = position;
    if (y < 0 || y >= this.data.walls.vertical.length) {
      return null;
    }
    const row = this.data.walls.vertical[y];
    if (x < 0 || x >= row.length) {
      return null;
    }
    return row[x];
  }
}
