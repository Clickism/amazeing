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
};

/**
 * Owl class
 */
export class Owl {
  data: OwlData;
  setData: (data: OwlData) => void;

  constructor(data: OwlData, setData: (data: OwlData) => void) {
    this.data = data;
    this.setData = setData;
  }

  /**
   * Move the owl forward in the direction it is currently facing.
   * @return Whether the move was successful.
   */
  move(): boolean {
    this.data.position = this.nextPosition();
    this.setData(this.cloneData());
    return true;
  }

  /**
   * Get the position in front of the owl based on its current direction.
   */
  nextPosition(): Position {
    const { position, direction } = this.data;
    return inDirection(position, direction);
  }

  /**
   * Turn the owl left or right.
   * @param direction The direction to turn (left or right).
   */
  turn(direction: LeftRight): void {
    this.data.direction = this.normalizeLeftRight(direction);
    this.setData(this.cloneData());
  }

  /**
   * Normalize a direction relative to the owl's current direction.
   * @param direction The direction to normalize.
   */
  normalizeDirection(direction: Direction): CardinalDirection | "here" {
    const owlDirection = this.data.direction;
    switch (direction) {
      case "north":
      case "east":
      case "south":
      case "west":
        return direction;
      case "left":
      case "right":
        return this.normalizeLeftRight(direction);
      case "front":
        return owlDirection;
      case "back":
        return oppositeDirection(owlDirection);
      case "here":
        return "here";
    }
  }

  private normalizeLeftRight(direction: LeftRight): CardinalDirection {
    let currentIndex = CARDINAL_DIRECTIONS.indexOf(this.data.direction);
    if (direction === "left") {
      currentIndex = (currentIndex + 3) % 4;
    } else {
      currentIndex = (currentIndex + 1) % 4;
    }
    return CARDINAL_DIRECTIONS[currentIndex];
  }

  private cloneData(): OwlData {
    return {
      position: { ...this.data.position },
      direction: this.data.direction,
    };
  }
}

/**
 * Owl class that can only move within the constraints of a level.
 */
export class LevelOwl extends Owl {
  level: Level;

  constructor(data: OwlData, setData: (data: OwlData) => void, level: Level) {
    super(data, setData);
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
    return this.level.canOwlMove(this.data, this.data.direction);
  }
}
