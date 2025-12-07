import type { Maze } from "./maze.ts";
import {
  type CardinalDirection,
  oppositeDirection,
  type Position,
} from "../interpreter/types.ts";
import { type Owl, OwlImpl } from "./owl.ts";

export type LevelData = {
  name: string;
  description: string;
  maze: Maze;
  owlStart: {
    position: Position;
    direction: CardinalDirection;
  };
  finishPosition: Position;
};

export class Level {
  data: LevelData;

  constructor(data: LevelData) {
    this.data = data;
  }

  createOwl(updateCallback: (owl: Owl) => void): Owl {
    return new OwlImpl(
      { ...this.data.owlStart.position },
      this.data.owlStart.direction,
      (newOwl) => updateCallback({ ...newOwl }),
    );
  }

  canOwlMove(owl: Owl): boolean {
    const { x, y } = owl.position;
    const { x: nextX, y: nextY } = owl.nextPosition();
    const fromTile = this.data.maze.tiles[y][x];
    const toTile = this.data.maze.tiles[nextY]?.[nextX];
    if (!toTile) {
      return false;
    }
    return (
      fromTile.walls[owl.direction] === null &&
      toTile.walls[oppositeDirection(owl.direction)] === null
    );
  }
}
