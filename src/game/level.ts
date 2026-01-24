import { Maze, type MazeData } from "./maze.ts";
import {
  type CardinalDirection,
  inDirection,
  type Position,
} from "../interpreter/types.ts";
import { type Owl, OwlImpl } from "./owl.ts";

export type LevelData = {
  id: string;
  name: string;
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

  createOwl(updateCallback: (owl: Owl) => void): Owl {
    return new OwlImpl(
      { ...this.data.owlStart.position },
      this.data.owlStart.direction,
      (newOwl) => updateCallback({ ...newOwl }),
    );
  }

  canOwlMove(owl: Owl, direction?: CardinalDirection): boolean {
    const directionToCheck = direction ?? owl.direction;
    const wall = this.maze.wallAt(owl.position, directionToCheck);
    const hasTile = this.maze.hasTileAt(inDirection(owl.position, directionToCheck));
    return wall === null && hasTile;
  }

  isOwlAtFinish(owl: Owl): boolean {
    return (
      owl.position.x === this.data.finishPosition.x &&
      owl.position.y === this.data.finishPosition.y
    );
  }
}
