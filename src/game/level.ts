import { Maze, type MazeData } from "./maze.ts";
import { type CardinalDirection, type Position } from "../interpreter/types.ts";
import { type Owl, OwlImpl } from "./owl.ts";

export type LevelData = {
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

  canOwlMove(owl: Owl): boolean {
    const wall = this.maze.wallAt(owl.position, owl.direction);
    return wall === null;
  }
}
