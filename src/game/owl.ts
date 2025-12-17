import {
  CARDINAL_DIRECTIONS,
  type CardinalDirection,
  type Direction,
  inDirection,
  type LeftRight,
  oppositeDirection,
  type Position
} from "../interpreter/types.ts";

/**
 * Represents the owl in the map.
 */
export interface Owl {
  position: Position;
  direction: CardinalDirection;

  move(): void;
  nextPosition(): Position;
  turn(direction: LeftRight): void;
  normalizeDirection(direction: Direction): CardinalDirection | "here";
}

export class OwlImpl implements Owl {
  position: Position;
  direction: CardinalDirection;
  updateCallback: (owl: Owl) => void;

  constructor(
    position: Position,
    direction: CardinalDirection,
    updateCallback: (owl: Owl) => void,
  ) {
    this.position = position;
    this.direction = direction;
    this.updateCallback = updateCallback;
  }

  move(): void {
    this.position = this.nextPosition();
    this.updateCallback(this);
  }

  nextPosition(): Position {
    return inDirection(this.position, this.direction);
  }

  turn(direction: LeftRight): void {
    this.direction = this.normalizeLeftRight(direction);
    this.updateCallback(this);
  }

  normalizeDirection(direction: Direction): CardinalDirection | "here" {
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
        return this.direction;
      case "back":
        return oppositeDirection(this.direction);
      case "here":
        return "here";
    }
  }

  private normalizeLeftRight(direction: LeftRight): CardinalDirection {
    let currentIndex = CARDINAL_DIRECTIONS.indexOf(this.direction);
    if (direction === "left") {
      currentIndex = (currentIndex + 3) % 4;
    } else {
      currentIndex = (currentIndex + 1) % 4;
    }
    return CARDINAL_DIRECTIONS[currentIndex];
  }
}
