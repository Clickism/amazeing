import {
  CARDINAL_DIRECTIONS,
  type CardinalDirection,
  type Position,
} from "../interpreter/types.ts";

export type MazeData = {
  tiles: TileType[][];
  walls: {
    horizontal: (WallType | null)[][];
    vertical: (WallType | null)[][];
  };
};

export type TileType = "grass" | "water";
export type WallType = "stone";

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
    return this.data.tiles[0].length;
  }

  /**
   * Gets the height of the maze.
   */
  height(): number {
    return this.data.tiles.length;
  }

  /**
   * Gets the tile at a given position.
   * @param position
   */
  tileAt(position: Position): TileType | null {
    const { x, y } = position;
    if (y < 0 || y >= this.data.tiles.length) {
      return null;
    }
    if (x < 0 || x >= this.data.tiles[y].length) {
      return null;
    }
    return this.data.tiles[y][x];
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
        if (y <= 0) return null;
        return this.data.walls.horizontal[y][x];
      case "south":
        if (y >= this.height() - 1) return null;
        return this.data.walls.horizontal[y + 1][x];
      case "east":
        if (x >= this.width() - 1) return null;
        return this.data.walls.vertical[y][x + 1];
      case "west":
        if (x <= 0) return null;
        return this.data.walls.vertical[y][x];
    }
  }

  forEachTile(callback: (position: Position, tile: TileType) => void) {
    const rows = this.height();
    const cols = this.width();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tile = this.tileAt({ x, y });
        if (tile !== null) {
          callback({ x, y }, tile);
        }
      }
    }
  }

  forEachWall(callback: (position: Position, direction: CardinalDirection, wall: WallType) => void) {
    const rows = this.height();
    const cols = this.width();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const pos = { x, y };
        for (const dir of CARDINAL_DIRECTIONS) {
          const wall = this.wallAt(pos, dir);
          if (wall !== null) {
            callback(pos, dir, wall);
          }
        }
      }
    }
  }
}
