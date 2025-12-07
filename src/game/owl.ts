import type { CardinalDirection, LeftRight, Position } from "../interpreter/types.ts";

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

const directions: CardinalDirection[] = ["north", "east", "south", "west"];

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
    const x = this.position.x;
    const y = this.position.y;
    switch (this.direction) {
      case "north":
        return { x: x, y: y - 1 };
      case "east":
        return { x: x + 1, y: y };
      case "south":
        return { x: x, y: y + 1 };
      case "west":
        return { x: x - 1, y: y };
    }
  }

  turn(direction: LeftRight): void {
    let currentIndex = directions.indexOf(this.direction);
    if (direction === "left") {
      currentIndex = (currentIndex + 3) % 4;
    } else {
      currentIndex = (currentIndex + 1) % 4;
    }
    this.direction = directions[currentIndex];
    this.updateCallback(this);
  }
}
