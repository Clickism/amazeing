import {
  CARDINAL_DIRECTIONS,
  type CardinalDirection,
  inDirection,
  type LeftRight,
  type Position,
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
    let currentIndex = CARDINAL_DIRECTIONS.indexOf(this.direction);
    if (direction === "left") {
      currentIndex = (currentIndex + 3) % 4;
    } else {
      currentIndex = (currentIndex + 1) % 4;
    }
    this.direction = CARDINAL_DIRECTIONS[currentIndex];
    this.updateCallback(this);
  }
}
