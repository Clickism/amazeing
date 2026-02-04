import { Maze, type MazeData } from "./maze.ts";
import {
  type CardinalDirection,
  inDirection,
  type Position,
} from "../interpreter/types.ts";
import { type OwlData } from "./owl.ts";

export type LevelData = {
  // The unique name of the level (within the level storage)
  name: string;
  // The displayed title of the level
  title: string;
  description: string;
  maze: MazeData;
  owlStart: {
    position: Position;
    direction: CardinalDirection;
  };
  finishPosition: Position;
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
    return wall === null && hasTile;
  }

  isOwlAtFinish(owl: OwlData): boolean {
    return (
      owl.position.x === this.data.finishPosition.x &&
      owl.position.y === this.data.finishPosition.y
    );
  }
}
