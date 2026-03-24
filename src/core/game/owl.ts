import {
  CARDINAL_DIRECTIONS,
  type CardinalDirection,
  type Direction,
  inDirection,
  type LeftRight,
  oppositeDirection,
  type Position
} from "../interpreter/types.ts";
import type { Level } from "./level.ts";

/**
 * Owl data type
 */
export type OwlData = {
  position: Position;
  direction: CardinalDirection;
  // Using a Set is easier here, even if strings are harder to work with.
  positionHistory: Set<string>;
};

/**
 * Owl class
 */
export class Owl {
  data: OwlData;

  constructor(data: OwlData) {
    this.data = data;
  }

  /**
   * Move the owl forward in the direction it is currently facing.
   * @return Whether the move was successful.
   */
  move(): boolean {
    const data = this.data;
    data.position = this.nextPosition(data);
    data.positionHistory.add(`${data.position.x}:${data.position.y}`);
    return true;
  }

  /**
   * Turn the owl left or right.
   * @param direction The direction to turn (left or right).
   */
  turn(direction: LeftRight): void {
    const data = this.data;
    data.direction = this.normalizeLeftRight(data, direction);
  }

  /**
   * Normalize a direction relative to the owl's current direction.
   * @param data The owl data to use for normalization.
   * @param direction The direction to normalize.
   */
  normalizeDirection(
    data: OwlData,
    direction: Direction,
  ): CardinalDirection | "here" {
    const owlDirection = data.direction;
    switch (direction) {
      case "north":
      case "east":
      case "south":
      case "west":
        return direction;
      case "left":
      case "right":
        return this.normalizeLeftRight(data, direction);
      case "front":
        return owlDirection;
      case "back":
        return oppositeDirection(owlDirection);
      case "here":
        return "here";
    }
  }

  /**
   * Get the position in front of the owl based on its current direction.
   */
  private nextPosition(data: OwlData): Position {
    const { position, direction } = data;
    return inDirection(position, direction);
  }

  private normalizeLeftRight(
    data: OwlData,
    direction: LeftRight,
  ): CardinalDirection {
    let currentIndex = CARDINAL_DIRECTIONS.indexOf(data.direction);
    if (direction === "left") {
      currentIndex = (currentIndex + 3) % 4;
    } else {
      currentIndex = (currentIndex + 1) % 4;
    }
    return CARDINAL_DIRECTIONS[currentIndex];
  }
}

/**
 * Owl class that can only move within the constraints of a level.
 */
export class LevelOwl extends Owl {
  level: Level;

  constructor(data: OwlData, level: Level) {
    super(data);
    this.level = level;
  }

  move(): boolean {
    if (!this.canMove()) {
      return false;
    }
    return super.move();
  }

  /**
   * Check if the owl can move in its current direction.
   */
  canMove(): boolean {
    const data = this.data;
    return this.level.canOwlMove(data, data.direction);
  }
}
